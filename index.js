var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";
var boardsEndpoint = "api/boards/";
var tasksEndpoint = "api/tasks/";
var usersBoardEndpoint = "api/users/boards/";

var ciObject;

var isPopupOpened = false;

function dateFormater(dateToFormat) {
    var day, month;
    day = dateToFormat.getDate();
    month = dateToFormat.getMonth();

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return dateToFormat.getFullYear() + "-" + month + "-" + day;
}

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setStatId(id) {
    $("#idcolCardCreate").val(id);
}

function getDataFormat(date) {
    return new Date(date).toLocaleString("en", {
        month: "short",
        day: "numeric",
    });
}

// function addCards() {
//     $.ajax({
//         type: "GET",
//         url: `${endpoint}${cardsEndpoint}`,
//         dataType: "json",
//         success: function (response) {
//             response.forEach((item) => {
//                 cardRender(item);
//             });

//             dragulaReload();
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error(`Error: ${textStatus} - ${errorThrown}`);
//         },
//     });
// }

function getTask(taskId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${tasksEndpoint}${taskId}`,
            success: function (response) {
                var responseTask = response;
                resolve(responseTask);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // reject(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    })

}

function getTasks(cardId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}/tasks`,
            success: function (response) {
                var responseTasks = response;
                resolve(responseTasks);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // reject(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    })

}

function toggleTaskCompletion(taskid) {

    $.ajax({
        type: "GET",
        url: `${endpoint}${tasksEndpoint}${taskid}/change-complete-status`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        contentType: "json",
        success: function (response) {
            console.log(response);
            getTask(taskid).then(task => {
                getTasks(task.idCard).then(responseTasks => {
                    updateProgress(responseTasks);
                })
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error: ${textStatus} - ${errorThrown}`);
        }
    });


}

function updateProgress(tasks, isDeleting = false) {
    const totalTasks = isDeleting == true ? tasks.length - 1 : tasks.length;
    const completedTasks = tasks.filter(task => task.iscompleted).length;
    const progressPercentage = Math.floor((totalTasks === 0) ? 0 : (completedTasks / totalTasks) * 100);
    

    $('.side-card-progress-bar-fill').stop().animate({
        width: `${progressPercentage}%`
    }, {
        duration: 500,
        easing: 'swing'
    });
    $('.side-card-progress-bar-fill').html(progressPercentage + "%");
}

function checkboxesReload(tasks) {
    $("input:checkbox").change(function (e) {
        e.stopImmediatePropagation()
        console.log(e.target);
        var identifier = $(e.target).attr("id").slice(0, 4) == "task" ? $(e.target).attr("id").slice(5) : undefined;
        if (identifier == undefined) return;

        toggleTaskCompletion(identifier);
        getTask(identifier).then(task => {
            getTasks(task.idCard).then(responseTasks => {
                updateProgress(responseTasks);
            })
        })

    })
}

function clickReload() {
    $(".main-card").on("mouseup", function () {
        var sidePanelObj = $(".side-panel-card");

        if (sidePanelObj.css("right")[0] == "-") {
            sidePanelObj.animate({
                "right": "10px"
            }, 850)
        }
        else {
            sidePanelObj.animate({
                "right": "-65%"
            }, 850)
        }
    })
}

function dragulaReload() {
    var drake = dragula($(".helping-container").toArray(), {
        invalid: function (el, handle) {
            return el.classList.contains("card-plus-but");
        },
    });

    drake.on("drop", function (el, target, source, sibling) {
        var cardid = $(el).data("card-id");
        var columnid = $(target).attr("id");
        var cardTitle = $(el).find('.card-main-text').text();

        console.log(cardid + " " + columnid);
        console.log($(target));
        
        $.ajax({
            type: "PUT",
            url: endpoint + cardsEndpoint,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                id: cardid,
                title: cardTitle,
                idStatus: columnid,
            }),
            success: function (data, status) {
                console.log(data);
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });

        // $(el).data("column-id") = columnid;
    });
}

function columnSettingsRender(id) {
    var target = "#" + id + ".main-card-men";
    console.log(target);
    getQuerryTemplate("Popup", { id: id }).then((resultHTML) => {
        $("#content").append(resultHTML);

        $("#" + id + ".popup-window").hide();

        $(target).on("click", function (e) {
            isPopupOpened = true;

            $("#" + id + ".popup-window").show();
            $("#" + id + ".popup-window").css("left", e.pageX).css("top", e.pageY);
        });
    }).catch(function (error) {
        console.log(error);
    });
}

function columnRender(data) {
    getQuerryTemplate("Column", { name: data.name, id: data.id }).then(
        (resultHTML) => {
            $("article.main-cards-container").append(resultHTML);
        }
    );

    columnSettingsRender(data.id);
}

function cardRender(data) {
    getQuerryTemplate("Card", {
        title: data.title,
        label: data.label,
        deadline: getDataFormat(data.deadline),
        cardid: data.id,
        columnid: data.idStatus,

    }).then((resultHTML) => {
        // Загружаем теги, соответствующие карте
        $.ajax({
            type: "GET",
            url: `${endpoint}api/cards/${data.id}/tags`,
            dataType: "json",
            success: function (response) {
                var tags = response.map(tag => tag.name).join(', '); // Преобразуем массив названий тегов в строку
                // Заменяем PLACEHOLDERtag на полученные теги в HTML-шаблоне карточки
                resultHTML = resultHTML.replace("PLACEHOLDERtag", tags);
                $("#" + data.idStatus + ".helping-container").prepend(resultHTML);

                clickReload();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            },
        });

        dragulaReload();
    });
}

function loadBoards() {
    var boards = Cookies.get("recent") != undefined ? JSON.parse(Cookies.get("recent")) : [];
    var usedIdentifiers = [];
    for(let i = 0; i < 3; i++) {
        let identifier;
        if(boards[i] != undefined) {
            identifier = boards[i];
        }
        else {
            continue;
        }

        $.ajax({
            type: "GET",
            url: `${endpoint}${boardsEndpoint}${boards[i]}`,
            dataType: "json",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (response) {
                $(".My-boards-container-dropdown-menu").prepend(`<li><a type="button" href="#http://127.0.0.1:5500/index.html?boardid=${boards[i]}">${response.name}</a></li>`)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(
                    `${textStatus} - ${errorThrown}`
                );
            },
        });
    }
}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: `${endpoint}${boardsEndpoint}${getUrlParameter("boardid")}`,
        dataType: "json",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);

            Object.keys(response.statusColumns).forEach((item) => {
                columnRender(response.statusColumns[item]);
            });

            Object.keys(response.cards).forEach((item) => {
                cardRender(response.cards[item]);
            });

            getQuerryTemplate("Title", response).then((resultHTML) => {
                $(".aside-h-container").append($(resultHTML));
                ciObject = new ChangingInput();
                ciObject.reload();
            })
            
            loadBoards();
            loadTags(response.tags);

            dragulaReload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(
                `Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`
            );
        },
    });

    // $.ajax({
    //     type: "GET",
    //     url: `${endpoint}${statusEndpoint}`,
    //     dataType: "json",
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //     },
    //     success: function (response) {
    //         console.log(response);
    //         Object.keys(response).forEach((item) => {
    //             columnRender(response[item]);
    //         });

    //         addCards();
    //         dragulaReload();
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.error(
    //             `Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`
    //         );
    //     },
    // });

    $("#buttonColumnCreate").on("click", function () {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                name: document.getElementById("titleColumnCreate").value.toString(), idBoard: getUrlParameter("boardid")
            }),
            success: function (data, status) {
                console.log(data);
                columnRender(data);
                dragulaReload();
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });

    $("#buttonCardCreate").on("click", function () {
        if ($("#titleCardCreate").val().length == 0) {
            console.warn("There is an error in data input!");
            return;
        }

        var data = {
            title: $("#titleCardCreate").val(),
            label: $("#textCardCreate").val(),
            startdate: dateFormater(new Date()),
            deadline: $("#dateCardCreate").val(),
            idStatus: $("#idcolCardCreate").val(),
            idBoard: getUrlParameter("boardid")
        };

        var tagId = $("#tagSelect").val();
        var userGuid = Cookies.get("userGUID");

        Object.keys(data).forEach(function (k) {
            if (data[k] == undefined) data[k] = null;
        });

        console.log(JSON.stringify(data));

        $.ajax({
            type: "POST",
            url: endpoint + cardsEndpoint,
            data: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (cardData, status) {
                console.log(cardData);
                cardRender(cardData);
                dragulaReload();

                if (tagId) {
                    addTagToCard(cardData.id, tagId);
                }
                if(userGuid){

                 addUserToCard(cardData.id,userGuid)

                }
             
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
        function addUserToCard(cardId, userGuid) {
            $.ajax({
                type: "POST",
                url: `${endpoint}api/user-card/cardId=${cardId}&userGuid=${userGuid}`,
                success: function (response) {
                    console.log(`User added to card: ${userGuid}`);
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }
            });
        }









    });

    $(document).on("click", ".main-card", function () {
        var cardId = $(this).data("card-id");
        var id_status = $(this).data("column-id");
        console.log("card-id" + cardId);
        updateCardSettingsMenu(cardId);
        updateColumnTitle(id_status);

        console.log("column-id" + id_status);

        var sidePanelObj = $(".side-panel-card");

        if (sidePanelObj.css("right")[0] == "-" || sidePanelObj.css("right")[0] == "0") {
            sidePanelObj.stop().animate({
                "right": "10px"
            }, 1500)
        }
        else {
            sidePanelObj.stop().animate({
                "right": "-65%"
            }, 1500)
        }

        $("textarea[placeholder='Add more detailed description...']").off('change').on('change', function () {
            var newLabel = $(this).val();
            saveCardLabel(cardId, newLabel);
        });


        $(document).on("click", ".delete-card-button", function () {
            deleteCard(cardId);
        });

        function deleteCard(cardId) {
            $.ajax({
                type: "DELETE",
                url: `${endpoint}${cardsEndpoint}${cardId}`,
                success: function (response) {
                    console.log(response);

                    $(`[data-card-id='${cardId}']`).remove();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }
            });
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////
        var labelsList = $('#labelsList');
        var labelsPopup = $('#labelsPopup');
        var currentBoardId = getUrlParameter("boardid");

        currentCardId = cardId;






        // Функция для загрузки тегов, привязанных к доске
        function loadBoardTags(boardId) {
            $.ajax({
                type: "GET",
                url: `${endpoint}api/boards/${boardId}/tags`,
                dataType: "json",
                success: function (response) {
                    renderLabels(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }
            });

            console.log("currentCardId:", currentCardId);


        }

        // Функция для отображения тегов
        function renderLabels(labels) {
            labelsList.empty();
            if (labels && labels.length > 0) {
                labels.forEach(function (label) {
                    var labelItem = $(`<div class="label-item" data-id="${label.id}">🏷️${label.name}</div>`);
                    labelItem.hover(
                        function () {
                            $(this).css({ backgroundColor: 'black', border: '1px solid #fff' });
                        },
                        function () {
                            $(this).css({ backgroundColor: '', border: '' });
                        }
                    );
                    labelItem.click(function () {
                        var tagId = $(this).data('id');
                        replaceCardTag(tagId);
                    });
                    labelsList.append(labelItem);
                });
            } else {
                labelsList.append(`<div>Нет тегов, привязанных к этой карте</div>`);
            }
        }

        // Функция для замены тега на карте
        function replaceCardTag(tagId) {

            $.ajax({
                type: "GET",
                url: `${endpoint}${cardsEndpoint}${currentCardId}`,
                dataType: "json",
                success: function (card) {
                    var currentTags = card.tagDTOs || [];
                    var tagIdsToRemove = currentTags.map(tag => tag.id);
                    console.log("fagIdsToRemove", tagIdsToRemove);

                    if (tagIdsToRemove.length > 0) {
                        var deletePromises = tagIdsToRemove.map(tagIdToRemove => {
                            return $.ajax({
                                type: "DELETE",
                                url: `${endpoint}api/card-tags/card=${currentCardId}&tag=${tagIdToRemove}`,
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.error(`Error deleting tag ${tagIdToRemove}: ${textStatus} - ${errorThrown}`);
                                }
                            });
                        });


                        $.when.apply($, deletePromises).done(function () {
                            addTagToCard(tagId);
                        });
                    } else {
                        //
                        addTagToCard(tagId);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error fetching card ${currentCardId}: ${textStatus} - ${errorThrown}`);
                }
            });
        }

        // Функция для добавления нового тега на карту
        function addTagToCard(tagId) {
            var cardTag = { idCard: currentCardId, idTags: tagId };
            console.log(cardTag);
            $.ajax({
                type: "POST",
                url: `${endpoint}api/card-tags`,
                contentType: "application/json",
                data: JSON.stringify(cardTag),
                success: function (response) {
                    console.log(`Тег добавлен на карту: ${tagId}`);
                    loadBoardTags(currentBoardId);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }

            });

        }




        // Обработчик клика на кнопку для открытия всплывающего окна с тегами
        $('#showLabelsBtn').on('click', function () {
            // Показать или скрыть всплывающее окно
            labelsPopup.toggle();


            if (labelsPopup.is(':visible')) {
                labelsPopup.css({
                    top: '10px',
                    left: '10px'
                });

                loadBoardTags(currentBoardId);
            }
        });

        // Закрытие всплывающего окна при клике вне его области
        $(document).mouseup(function (e) {
            if (!labelsPopup.is(e.target) && labelsPopup.has(e.target).length === 0) {
                labelsPopup.hide();
            }
        });

        // Обработчик клика на кнопку для создания нового тега
        $('#createLabelBtn').on('click', function () {
            var newLabelName = $('#newLabelName').val().trim();
            if (newLabelName === "") {
                alert("Введите название тега");
                return;
            }

            var newTag = {
                name: newLabelName,
                idBoard: currentBoardId
            };
            console.log(newTag);

            $.ajax({
                type: "POST",
                url: `${endpoint}api/tags`,
                contentType: "application/json",
                data: JSON.stringify(newTag),
                success: function (response) {
                    $('#newLabelName').val('');
                    loadBoardTags(currentBoardId);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }
            });
        });






              ////////////////////////////////////////////////////////////////


        $(document).ready(function () {
            var currentBoardId = getUrlParameter("boardid"); // Замените на реальный Id текущей доски
            currentCardId = cardId;

            // Обработчик клика на кнопку для открытия всплывающего окна с пользователями
            $('#showMembersBtn').on('click', function () {
                // Показать или скрыть всплывающее окно
                $('#membersPopup').toggle();

                // Устанавливаем позицию всплывающего окна в верхнем левом углу
                if ($('#membersPopup').is(':visible')) {
                    $('#membersPopup').css({
                        top: '10px',
                        left: '10px'
                    });
                    // Загрузка пользователей при открытии окна
                    loadMembers(currentBoardId, currentCardId);
                }
            });

            // Закрытие всплывающего окна при клике вне его области
            $(document).mouseup(function (e) {
                var membersPopup = $('#membersPopup');
                if (!membersPopup.is(e.target) && membersPopup.has(e.target).length === 0) {
                    membersPopup.hide();
                }
            });

            function loadMembers(boardId, cardId) {
                $.ajax({
                    type: "GET",
                    url: `${endpoint}api/boards/${boardId}`,
                    dataType: "json",
                    success: function (response) {
                        renderMembers(response, cardId);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(`Error: ${textStatus} - ${errorThrown}`);
                    }
                });
            }

            function renderMembers(boardData, cardId) {
                var cardMembersList = $('#cardMembersList');
                var boardMembersList = $('#boardMembersList');
                cardMembersList.empty();
                boardMembersList.empty();

                var cardMembers = boardData.cards.find(card => card.id === cardId).userDtos || [];
                var boardMembers = boardData.users || [];
                console.log("cardMembers", cardMembers)
                console.log("boardMembers", boardMembers)


                var cardMemberGuids = cardMembers.map(member => member.guid);
                var nonCardMembers = boardMembers.filter(member => !cardMemberGuids.includes(member.guid));
                console.log("cardMemberGuids", cardMemberGuids)
                console.log("nonCardMembers", nonCardMembers)
                cardMembers.forEach(function (member) {
                    var memberItem = $(`<div class="member-item" data-guid="${member.guid}">👥${member.userName}</div>`);
                    cardMembersList.append(memberItem);
                });

                nonCardMembers.forEach(function (member) {
                    var memberItem = $(`<div class="member-item" data-guid="${member.guid}">👥${member.userName}</div>`);
                    memberItem.dblclick(function () {
                        addUserToCard(currentCardId, member.guid);
                    });
                    boardMembersList.append(memberItem);
                });
            }
            function addUserToCard(cardId, userGuid) {
                $.ajax({
                    type: "POST",
                    url: `${endpoint}api/user-card/cardId=${cardId}&userGuid=${userGuid}`,
                    success: function (response) {
                        console.log(`User added to card: ${userGuid}`);
                        loadMembers(currentBoardId, currentCardId);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(`Error: ${textStatus} - ${errorThrown}`);
                    }
                });
            }

            function getUrlParameter(name) {
                var urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(name);
            }
        });
            

































    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function updateCardSettingsMenu(cardId) {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}`,
            dataType: "json",
            success: function (response) {
                console.log(response);
                $("textarea[placeholder='Add more detailed description...']").val(response.label);
                $(".side-card-side-card-text").text(response.title);

                if (response.taskDTOs != undefined) {
                    getQuerryTemplate("Tasksdiv", {cardid: cardId}).then(resultHTML => {

                        $("#task-cont-div").html(resultHTML);
                        
                        renderTasks(response.taskDTOs);
                        updateProgress(response.taskDTOs);


                    })

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }
    function updateColumnTitle(id_status) {

        $.ajax({
            type: "GET",
            url: `${endpoint}${statusEndpoint}${id_status}`,
            dataType: "json",
            success: function (response) {

                var columnTitle = response.name;


                $(".side-card-side-card-column-text").text("In the column " + columnTitle);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }

    // function updateCardLabel(cardId) {
    //     $.ajax({
    //         type: "GET",
    //         url: `${endpoint}${cardsEndpoint}${cardId}`,
    //         dataType: "json",
    //         success: function (response) {
    //             var cardLabel = response.label;
    //             $("textarea[placeholder='Add more detailed description...']").val(cardLabel);
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             console.error(`Error: ${textStatus} - ${errorThrown}`);
    //         }
    //     });
    // }

    function saveCardLabel(cardId, newLabel) {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}`,
            dataType: "json",
            success: function (cardData) {

                cardData.label = newLabel;


                $.ajax({
                    type: "PUT",
                    url: `${endpoint}${cardsEndpoint}`,
                    contentType: "application/json",
                    data: JSON.stringify(cardData),
                    success: function (response) {
                        console.log(`Card ${cardId} label updated successfully`);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(`Error: ${textStatus} - ${errorThrown}`);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }





    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    






  


    ///начало работы с тасками ////////////////////////////////////////////////////////////////////////////////////////////////






    function createTask(taskData) {
        $.ajax({
            type: "POST",
            url: `${endpoint}${tasksEndpoint}`,
            data: JSON.stringify(taskData),
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                renderTask(response);
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }

    function deleteTask(tasksId) {
        getTask(tasksId).then(task => {
            getTasks(task.idCard).then(responseTasks => {
                updateProgress(responseTasks, true);
            })
        })

        $.ajax({
            type: "DELETE",
            url: `${endpoint}${tasksEndpoint}${tasksId}`,
            success: function (response) {
                console.log(response);
                $("div.actualy-task-container#" + tasksId).remove();
                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }







    function renderTasks(tasks) {
        tasks.forEach(task => {
            renderTask(task);
        })

        $("#AddTask").on("click", function() {
            createTask({title: "click me", idCard: $(this).data("cardid")})
        })
    }

    function renderTask(task) {
        getQuerryTemplate("Taskobj", task).then(resultHTML => {
            var $result = $(resultHTML);

            $("#tasks-div").append($result);
            $result.find(".cross-ico-task").off("click").on("click", function() {
                deleteTask($(this).attr("id"))
            });
            checkboxesReload();
            ciObject.reload();
        })
    }




















    ///конец работы с тасками ////////////////////////////////////////////////////////////////////////////////////////////////

    $(document).mouseup(function (e) {
        var divs = $(".popup-window");
        if (divs == null) {
            return;
        }

        divs.hide();
    });

    function loadTags(tags) {
        tags.forEach(tag => tagSelect.append(new Option(tag.name, tag.id)))
    }

    $('#My-boards-button').on('click', function (event) {
        var $menu = $('.My-boards-container-dropdown-menu');
        if ($menu.hasClass('show')) {
            $menu.removeClass('show');
        } else {
            $menu.addClass('show');
        }
        event.stopPropagation();
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.My-boards-container').length) {
            $('.My-boards-container-dropdown-menu').removeClass('show');
        }
    });

    $('.My-boards-container-dropdown-menu li').on('click', function () {
        $('.My-boards-container-dropdown-menu').removeClass('show');
    });

    $(document).mouseup(function (e) {
        if (isPopupOpened &&
            (!$(e.target).hasClass("popup-window") &&
                $(e.target).closest(".popup-window").length == 0)) {
            console.log("Text;");
            isPopupOpened = false;
            $(".popup-window").toArray().forEach(element => {
                $(element).hide();
            })
        }

        if ($(".side-panel-card").css("right")[0] != "-"
            && $(e.target).closest(".side-panel-card").length == 0) {
            $(".side-panel-card").animate({
                "right": "-65%"
            }, 1500)
        }
    });



    function addTagToCard(cardId, tagId) {
        $.ajax({
            type: "POST",
            url: `${endpoint}api/card-tags`,
            data: JSON.stringify({ IdCard: cardId, IdTags: tagId }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (response) {
                console.log("Tag added to card:", response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            },
            dataType: "json",
        });
    }

    $(".account-button").on("mouseup", function (e) {
        if ($(".user-settings-container").css("display") == "none") {
            $(".user-settings-container").show();
        }
    })

    $(document).on("click", function (e) {
        if ($(".user-settings-container").css("display") != "none" &&
            (!$(e.target).hasClass(".user-settings-container") &&
                $(e.target).closest(".account-button").length == 0)) {
            $(".user-settings-container").hide();
        }
    })

    $(".logout-butt").on("click", function () {
        console.log(Cookies.get("userGUID"));
        if (Cookies.get("userGUID") != null) {
            Cookies.remove("userGUID");
            window.location.href = 'http://127.0.0.1:5500/reglog.html';
        }
    })

    
});


// BUTTON SETTINGS ROOTING

$(document).ready(function () {
    $("#settings-button-js").click(function () {
        var userGUID = Cookies.get("userGUID");
        if (userGUID != null) {
            var targetUrl = 'http://127.0.0.1:5500/profile-settings/profile_settings.html?userGUID=' + encodeURIComponent(userGUID) + '#public-profile';
            window.location.href = targetUrl;
        } else {
            console.log("userGUID is not available");
        }
    });
});

