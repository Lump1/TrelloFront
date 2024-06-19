class ChangingInput {
    #changeToInput(element) {
        //console.log("Changing to input for element:", element);
        const self = this;

        var newElement = $(`<input 
                                id="${$(element).data("ci-id")}"
                                data-element-type="${$(element).prop('nodeName')}" 
                                data-element-class="${$(element).attr("class")}" 
                                data-element-id="${$(element).attr("id")}"
                                data-ci-url="${$(element).data("ci-url")}"
                                data-req-var-name="${$(element).data("req-var-name")}"
                                class="ci-input-form"
                                value="${$(element).html().trim()}"
                                style="font-size: 80%"
                            />`);
    
        //console.log("New input element created:", newElement);
        $(element).before(newElement);
        $(element).remove();
    }
    
    #changeFromInput(element) {
        //console.log("Changing from input for element:", element);
        const self = this;

        var newElement = $(`<${$(element).data('element-type')} 
                                data-ci-id="${$(element).attr("id")}" 
                                data-ajax="${$(element).attr("id")}" 
                                class="${$(element).data("element-class") || ""}" 
                                data-ci-url="${$(element).data("ci-url")}"
                                data-req-var-name="${$(element).data("req-var-name")}"
                                id="${$(element).data("element-id")}"
                            >
                                ${$(element).val().trim()}
                            </${$(element).data('element-type')}>`);
        //console.log("New non-input element created:", newElement);
        $(element).before(newElement);
        $(element).remove();

        self.#reload(newElement);
    }

    #initialization() {
        const self = this;
        //console.log("Initialization started");
        $(`[data-ci-id]`).off("click").on("click", function() {
            //console.log("On click event triggered");
            var selectedElement = $(this);
            //console.log("Selected element:", selectedElement);
            self.#changeToInput(selectedElement);
            //console.log("Changed to input");

            setTimeout(() => {
                var selectedInput = $(`input#${selectedElement.data("ci-id")}.ci-input-form`);
                //console.log("Selected input after 100ms delay:", selectedInput);

                if (selectedInput.length > 0) {
                    selectedInput.focus();
                    selectedInput.on("blur", function() {
                        //console.log("Input blur event triggered");
                        var data = { id: selectedInput.attr("id") };
                        data[selectedInput.data("req-var-name")] = selectedInput.val();
                        //console.log("Data to send:", data);
                        Ajax.request(selectedInput.data("ci-url"), "PUT", data).then(() => {
                            self.#changeFromInput(selectedInput);
                        }).catch(err => {
                            //console.error("Ajax request failed:", err);
                        });
                    });
                } else {
                    //console.error("Selected input not found:", selectedInput);
                }
            }, 100);
        });
    }

    reloadElement(reloadingElement) {
        const self = this;
        //console.log("Reloading specific element:", reloadingElement);
        self.#reload(reloadingElement);
    }

    reload() {
        const self = this;
        //console.log("Reloading all elements");
        self.#initialization();
    }

    #reload(reloadingElement) {
        const self = this;

        //console.log("Reloading specific element:", reloadingElement);
        reloadingElement.off("click").on("click", function() {
            //console.log("On click event triggered");
            var selectedElement = $(this);
            //console.log("Selected element:", selectedElement);
            self.#changeToInput(selectedElement);
            //console.log("Changed to input");

            // Небольшая задержка перед привязкой событий
            setTimeout(() => {
                var selectedInput = $(`input#${selectedElement.data("ci-id")}.ci-input-form`);
                //console.log("Selected input after 100ms delay:" + `input#${selectedElement.data("ci-id")}.ci-input-form`);

                if (selectedInput.length > 0) {
                    selectedInput.focus();
                    selectedInput.on("blur", function() {
                        //console.log("Input blur event triggered");
                        var data = { id: selectedInput.attr("id") };
                        data[selectedInput.data("req-var-name")] = selectedInput.val();
                        //console.log("Data to send:", data);
                        Ajax.request(selectedInput.data("ci-url"), "PUT", data).then(() => {
                            self.#changeFromInput(selectedInput);
                        }).catch(err => {
                            //console.error("Ajax request failed:", err);
                        });
                    });
                } else {
                    //console.error("Selected input not found:", selectedInput);
                }
            }, 100);
        });
    }

    constructor() {
        this.#initialization();
        //console.log("Constructor was called");
    }
}

class Ajax {
    static request(url, method, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                method: method,
                url: url,
                data: JSON.stringify(data),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                dataType: "json",
                success: function (response) {
                    resolve(response);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(`${textStatus} - ${errorThrown}`);
                },
            });
        });
    }
}

