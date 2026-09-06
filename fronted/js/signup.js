const password=document.getElementById("password");

const confirm=document.getElementById("confirmPassword");

document.getElementById("togglePassword").onclick=()=>{

password.type=password.type==="password"
?"text":"password";

}

document.getElementById("toggleConfirm").onclick=()=>{

confirm.type=confirm.type==="password"
?"text":"password";

}

password.addEventListener("keyup",()=>{

const strength=document.getElementById("strength");

let score=0;

if(password.value.length>=8)score++;

if(/[A-Z]/.test(password.value))score++;

if(/[0-9]/.test(password.value))score++;

if(/[^A-Za-z0-9]/.test(password.value))score++;

const txt=["Weak","Medium","Good","Strong"];

const color=["red","orange","#0ea5e9","lime"];

strength.innerHTML=password.value
?`Password Strength :
<span style="color:${color[score-1]||"red"}">
${txt[score-1]||"Weak"}
</span>`
:"";

});

document.getElementById("signupForm")
.addEventListener("submit",async(e)=>{

e.preventDefault();

if(password.value!==confirm.value){

alert("Passwords do not match");

return;

}

const res=await fetch("https://rakshak-ai-alpha.vercel.app/api/auth/signup",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

name:document.getElementById("name").value,

email:document.getElementById("email").value,

phone:document.getElementById("phone").value,

password:password.value

})

});

const data=await res.json();

if(res.ok){

alert("Account Created Successfully");

window.location="login.html";

}else{

alert(data.message);

}

});