class changingInput {
    #changeToInput(element) {
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
                            />`);
    
        $(element).before(newElement);
        $(element).remove();
    }
    
    #changeFromInput(element) {
        const self = this;

        var newElement = $(`<${$(element).data('element-type')} 
                                data-ci-id="${$(element).attr("id")}" 
                                data-ajax="${$(element).attr("id")}" 
                                class="${$(element).data("element-class") != undefined ? $(element).data("element-class") : ""}" 
                                data-ci-url="${$(element).data("ci-url")}"
                                data-req-var-name="${$(element).data("req-var-name")}"
                                id="${$(element).data("element-id")}"
                            >
                                ${$(element).val().trim()}
                            </${$(element).data('element-type')}>`);
        $(element).before(newElement);
        $(element).remove();

        self.#reload(newElement);
        
    }


    // #elementDataCopy(elementToCopy) {
    //     elementToCopy.
    // }

    #initialization() {
        const self = this;

        $(`[data-ci-id]`).on("click", function() {
            var selectedElement = $(this);
            self.#changeToInput(selectedElement);

            var selectedInput = $(`.ci-input-form#${selectedElement.data("ci-id")}`);
            selectedInput.focus();
            selectedInput.blur(function() {
                self.#changeFromInput($(this));
            });
        });
    }

    #reload(reloadingElement) {
        const self = this;

        reloadingElement.on("click", function() {
            var selectedElement = $(this);
            self.#changeToInput(selectedElement);

            var selectedInput = $(`.ci-input-form#${selectedElement.data("ci-id")}`);
            selectedInput.focus();
            selectedInput.blur(function() {
                Ajax.request(self.data("ci-url"), "PUT", {})
                self.#changeFromInput($(this)); 
            });
        })
    }

    // #clearSymbols(value) {
    //     for(let i = 1; i < value.length - 1; i++) {
    //         if(value[i - 1] == ' ' )
    //     }
    // }

    constructor() {
        this.#initialization();
        console.log("constructor was called");
    }
}

class Ajax {
    static request(url, method, data) {
        $.ajax({
            method: method,
            url: url,
            data: data,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            dataType: "json",
        })
    }
}