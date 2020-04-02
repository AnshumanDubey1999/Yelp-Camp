var inputBoxes = document.querySelectorAll("input")
console.log("js Active!")
var passwordValidity = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
var nameValidity = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")
var usernameValidity = new RegExp("^[a-zA-Z0-9]*$")
var urlValidity = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$")
var emailValidity = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
var numberValidity = new RegExp("^(?=.*[0-9])(?=.{8,})")
var validity
var submitButton = document.querySelector(".btn");
var passwordHint = document.querySelector(".form-text")
passwordHint.getElementsByClassName.display = "none"

inputBoxes.forEach(function(element){
    element.classList.add("invalidInput")
})

for(var i = 0; i < 2; i++){
    inputBoxes[i].addEventListener("keyup", function(){
        setValidity(this, nameValidity.exec(this.value))
        activateSubmit()
    })
}

inputBoxes[2].addEventListener("keyup", function(){
    setValidity(this, usernameValidity.exec(this.value))
    activateSubmit()
})

inputBoxes[3].addEventListener("keyup", function(){
    setValidity(this, urlValidity.exec(this.value))
    activateSubmit()
})

inputBoxes[4].addEventListener("keyup", function(){
    setValidity(this, numberValidity.exec(this.value))
    activateSubmit()
})

inputBoxes[5].addEventListener("keyup", function(){
    setValidity(this, emailValidity.exec(this.value))
    activateSubmit()
})

inputBoxes[7].addEventListener("keyup", function(){
        
        var t = inputBoxes[6].value;
        var s = this.value;
        setValidity(this, (s===t && validity))
        activateSubmit()
            
})

inputBoxes[6].addEventListener("keyup", function(){
    var s = this.value;
    var t = inputBoxes[7].value;
    validity = passwordValidity.exec(s)
    if(validity)
        passwordHint.style.display = "none"
    else
        passwordHint.style.display = "block"
    setValidity(this, validity)
    setValidity(inputBoxes[7], (s===t && validity))
    activateSubmit()
})

function setValidity(element, isValid){
    if(isValid){
        element.classList.remove("invalidInput")
        element.classList.add("validInput")
    }else{
        element.classList.remove("validInput")
        element.classList.add("invalidInput")
    }
}

function activateSubmit(){
    var flag = true
    for(var i = 0; i < inputBoxes.length; i++){
        if(inputBoxes[i].classList.contains("invalidInput")){
            flag = false
            break
        }
    }
    if(flag)
        submitButton.disabled = false;
    else    
        submitButton.disabled = true
}