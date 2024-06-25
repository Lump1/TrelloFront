function getTemplate(templates, target) {
    var startTarget = "startPoint" + target;
    var endTarget = "breakPoint" + target;

    var startIndex = templates.indexOf(startTarget);
    var endIndex = templates.lastIndexOf(endTarget);

    return templates.substring(startIndex + startTarget.length, endIndex).trim();
}

function getQuerryTemplate(target, argumentalObject) {  
    return new Promise((resolve, reject) => {
        $.get('templates.html', function(templates) {
            var template = getTemplate(templates, target);

            Object.keys(argumentalObject).forEach(key => {
                template = template.replaceAll("PLACEHOLDER" + key.toLowerCase(), argumentalObject[key]);
            });

            var resultHTML = template;
            resolve(resultHTML);
        });
    });
}
