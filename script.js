const lengthSlider = document.querySelector(".pass-length input"),
options = document.querySelectorAll(".option input"),
copyIcon = document.querySelector("#div2 span"),
passwordInput = document.querySelector(".input-box input"),
passIndicator = document.querySelector(".pass-indicator"),
fileNameInput = document.querySelector(".file-name #filename"),
selectMenu = document.querySelector(".save-as #select-file"),
saveBtn = document.querySelector(".save-btn"),
generateBtn = document.querySelector(".generate-btn");
var str = document.getElementById("user_input"),
str2 = document.getElementById("user_input2"),
NoOfPasswords = document.querySelector(".no_of_Passwords input");

const characters = { // object of letters, numbers & symbols
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "^!$%&|[](){}:;.,*+-#@<>~"
}

var passwords =[];
const generatePassword = () => {
    let staticPassword = "",
    randomPassword = "",
    excludeDuplicate = false,
    passLength = lengthSlider.value;
    var row = 0;
    // clear passwords array
    passwords = [];
    options.forEach(option => { // looping through each option's checkbox
        if(option.checked) { // if checkbox is checked
            // if checkbox id isn't exc-duplicate && spaces
            if(option.id !== "exc-duplicate" && option.id !== "spaces") {
                // adding particular key value from character object to staticPassword
                staticPassword += characters[option.id];
            } else if(option.id === "spaces") { // if checkbox id is spaces
                staticPassword +=   `${staticPassword} ` ; // adding space at the beginning & end of staticPassword
            } else { // else pass true value to excludeDuplicate
                excludeDuplicate = true;
            }
        }
    });

    options.forEach(option => { // looping through each option's checkbox
        if(option.checked) { // if checkbox is checked
                
            if(option.id == "add-pre-fix") {
                passLength = passLength - str.value.length;
            } else if(option.id === "add-post-fix") { 
                passLength = passLength - str2.value.length;
            } else { 
                randomPassword;
            }
        }
    });

    if(NoOfPasswords.value > 99999){
        alert("Limit exceeded. \nValid range 1 - 99999.")
    }
    else{
        for(let n = 0; n < NoOfPasswords.value ; n++ )
        {

            for (let i = 0; i < passLength; i++) {
                // getting random character from the static password
                let randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
                if(excludeDuplicate) { // if excludeDuplicate is true
                    // if randomPassword doesn't contains the current random character or randomChar is equal 
                    // to space " " then add random character to randomPassword else decrement i by -1
                    !randomPassword.includes(randomChar) || randomChar == " " ? randomPassword += randomChar : i--;
                }
                else { // else add random character to randomPassword
                    randomPassword += randomChar;
                }
                    
            }

            options.forEach(option => { // looping through each option's checkbox
                if(option.checked) { // if checkbox is checked
                            
                    if(option.id == "add-pre-fix") {
                        randomPassword = str.value + randomPassword;
                    } 
                    else if(option.id == "add-post-fix") { 
                        randomPassword = randomPassword + str2.value; 
                    } 
                    else { 
                        randomPassword;
                    }
                }
            });

            passwords.push(randomPassword);

            passwordInput.value = randomPassword; // passing randomPassword to passwordInput value
         
            randomPassword = "";
        
            let passward = passwords[n];
                    
            var display = document.getElementById("display");

            var newRow = display.insertRow(row);

            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);

            cell1.innerText = row + 1;
            cell2.innerText = passward;

            row++;
            
        }    
    }
}

// clear display
var entry = document.getElementById("entry");
entry.addEventListener("click",clearDisplay);

function clearDisplay(){
    for(let i = 0 ; i < 100000 ; i++){
        var table = document.querySelector("tr");
        table.remove();  
    }   
}


const upadatePassIndicator = () => {
    // if lengthSlider value is less than 8 then pass "weak" as passIndicator id else if lengthSlider 
    // value is less than 16 then pass "medium" as id else pass "strong" as id
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 15 ? "medium" :  "strong";
}

const updateSlider = () => {
    NoOfPasswords.value = "" ;
    // passing slider value as counter text
    document.querySelector(".pass-length span").innerText = lengthSlider.value;
    generatePassword();
    upadatePassIndicator();
    
}
updateSlider();

const copyPassword = () => {
    navigator.clipboard.writeText(passwords); // copying random password
    copyIcon.innerText = "check"; // changing copy icon to tick
    copyIcon.style.color = "#4285F4";
    setTimeout(() => { // after 1500 ms, changing tick icon back to copy
        copyIcon.innerText = "copy_all";
        copyIcon.style.color = "#707070";
    }, 1500);
}

copyIcon.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", updateSlider);
generateBtn.addEventListener("click",generatePassword);

// select manu for download txt,json,xml files 
selectMenu.addEventListener("change", () => {
    const selectedFormat = selectMenu.options[selectMenu.selectedIndex].text;
    saveBtn.innerText = `save as ${selectedFormat.split(" ")[0]} File`;
});

// download txt, json, xml files
saveBtn.addEventListener("click", () => {
    const blob = new Blob([passwords], {type: selectMenu.value});
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileNameInput.value;
    link.href = fileUrl;
    link.click();
});
