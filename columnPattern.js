var columnPattern = `
    <div class="main-card-container rounded-2" id="PLACEHOLDERid">
    <div class="header-card-container">
        <p class="main-card-p">PLACEHOLDERtitle</p>
        <p class="main-card-men">•••</p>
    </div>
    <div class="helping-container"id="PLACEHOLDERid">
        <a href="#create" rel="modal:open" onclick="setStatId(PLACEHOLDERid)" id="PLACEHOLDERid">
            <div class="card-plus-but rounded-2">
                <div class="animation-wrapper">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <img src="assets/plus.png" class="card-m-img plus-img">
            </div>
        </a>
    </div>
    </div>
`;

function createColumnWithData(title,id) {
    var stringRes = columnPattern.replace("PLACEHOLDERtitle", title);
    stringRes= stringRes.replaceAll("PLACEHOLDERid", id);
    return stringRes;
}


var cardPattern = `
 
            <div class="main-card rounded-2">
                <div class="card-header-man">
                    <p class="card-tag card-sm-text">Backend</p>
                </div>
                <div class="card-main">
                    <p class="card-main-text card-text">PLACEHOLDERtitle</p>
                </div>
                <div class="card-footer-man">
                    <div class="d-inline-flex">
                        <img src="assets/free-icon-clock-2088617.png" class="card-sm-img clock-img">
                        <p class="card-text card-sm-text text-footer sm-mar-l">PLACEHOLDERdeadline</p>
                    </div>
                </div>
            </div>

`;
function createCardWithData(title, label, text, deadline) {
    var stringRes = cardPattern.replace("PLACEHOLDERtitle", title);
    stringRes = stringRes.replace("PLACEHOLDERdeadline", deadline);
    return stringRes;
}