
let profileBox = document.getElementsByClassName('profile')[0];
let show = false;

// profile
let email = document.getElementById('email');
let name = document.getElementById('name');
let img = document.getElementById('profilePic');
let topProfilePic = document.getElementById('topProfilePic');


function setProfile(user){
    console.log('noor',user);
    email.innerText = user.email;
    name.innerText = user.displayName.toLowerCase();
    if(user.photoURL){
        img.setAttribute('src', user.photoURL);
        topProfilePic.setAttribute('src', user.photoURL);
    }
}


function showProfile(e){
    show = !show;
    profileBox.style.display = show ? 'block' : 'none';
}
