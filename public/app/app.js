var _db = "";
var userExists = false;
var userFullName = "";
var _userProfileInfo = {};
  
  function updateUserInfo(userObj) {
    let id = firebase.auth().currentUser.uid;
    _db.collection("Users").doc(id).update(userObj).then(() =>{
      console.log("updated doc ")
    }).catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("update error " + errorMessage);
    })
  }

function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    // console.log(hashTag + " " + pageID);

    if (pageID != ""){
    $.get(`pages/${pageID}/${pageID}.html`, function(data){
        // console.log("data " + data);
        $("#app").html(data);
    });

}else {
    $.get(`pages/home/home.html`, function(data){
        // console.log("data " + data);
        $("#app").html(data);
    });
    initListeners();
}
}

function initListeners(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
};

function initFirebase(){
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            _db = firebase.firestore();
            console.log("auth changed logged in");
            if(user.displayName){
                $(".name").html(user.displayName);
            }
            $(".signOut").prop("hidden", false);
            userExists = true;
        }else{
            _db = "";
            _userProfileInfo = {};
            console.log("auth changed logged out");
            $(".name").html("");
            $(".signOut").attr("hidden", true);
            userExists = false;
            userFullName = "";
        }
    })
};

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("signed out");
        })
        .catch((error) => {
            console.log("Error Signing out");
        });
}

function login() {
    let email = $("#log-email").val();
    let pw = $("#log-pw").val();

    firebase
    .auth()
    .signInWithEmailAndPassword(email, pw)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

    $("#log-email").val("");
    $("#log-pw").val("");
    _db.collection("Users").doc(user.uid).get().then((doc) => {
        _userProfileInfo = doc.data();      
        console.log("login userinfo ", _userProfileInfo);

    })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
}


function createAccount() {
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let pw = $("#pw").val();
    let fullName = fName + " " + lName;
    let userObj = {
        firstName: fName,
        lastName: lName,
        email: email,
        recipes: [],
    };

    // console.log("create " + fName + " " + lName + " " + email + " " + pw);

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, pw)
    .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...
    console.log("created")
    firebase.auth().currentUser.updateProfile({
        displayName: fullName,
    });

    _db.collection("Users").doc(user.uid).set(userObj).then((doc) => {
        console.log("doc added ");
        // _userProfileInfo = userObj;
        // console.log("create userinfo " + _userProfileInfo)
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(`create error ${errorMessage}`);
      });


    userFullName = fullName
    $(".name").html(userFullName);
    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#pw").val("");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
  });

}

const buttonThree = document.querySelector('.button-three');

buttonThree.addEventListener('click', () => {
  const isOpened = buttonThree.getAttribute('aria-expanded');
  if (isOpened === 'false') {
    buttonThree.setAttribute('aria-expanded', 'true');
  }else {
    buttonThree.setAttribute('aria-expanded', 'false');
  }
})


const navMenu = document.querySelector(".nav-menu");

buttonThree.addEventListener("click", () => {
  navMenu.classList.toggle("active");
})

document.querySelectorAll(".links, .log-in").forEach(n => n.addEventListener("click", () => {
  navMenu.classList.remove("active");
}))


$(document).ready(function(){
    try {
        let app = firebase.app();
        initFirebase();
        initListeners();
        loginListener();
        

    }catch(error){
        
    }
});