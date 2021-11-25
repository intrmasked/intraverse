// Import the functions you need from the SDKs you need
import { initializeApp 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  setDoc,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

import {
    getFunctions,
    httpsCallable
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-functions.js";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5jlQtwvTmak3eh6vseiXd4eSGX_o01m8",
  authDomain: "intraverse-3aa8e.firebaseapp.com",
  projectId: "intraverse-3aa8e",
  storageBucket: "intraverse-3aa8e.appspot.com",
  messagingSenderId: "1042168311165",
  appId: "1:1042168311165:web:9786308d1dfd448fed7014",
  measurementId: "G-ZE3VX2ZB8F"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const functions = getFunctions(app,'us-east1');

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const refferal = document.querySelector("#refferalText");
// login function
$("#login").click(function () {
  $(this).find('i').css('display','block');
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      $(this).find('i').css('display','none');
      // Signed in
      const user = userCredential.user;

      if (!user.emailVerified) {
        toastr.error('Email not verified', 'Error!',{timeOut:9500})
        sendEmailVerification(auth.currentUser).then(() => {});
      } else if (user.emailVerified) {
        localStorage.setItem('uid',user.uid);
       
       window.location.href = 'dashboard.html'
      }
    })
    .catch((error) => {
      $(this).find('i').css('display','none');
      const errorCode = error.code;
      const errorMessage = error.message;
      toastr.error('Wrong Details', 'Error!',{ timeOut: 9500 })
    });
});

// create a user
$("#refButton").click(function () {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  $(this).find('i').css('display','block');
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      $(this).find('i').css('display','none');
      // Signed in
      const user = userCredential.user;
      localStorage.setItem('uid',user.uid);
      if (!user.emailVerified) {
         window.location.herf = "check_inbox.html";
        sendEmailVerification(auth.currentUser).then(() => {
          storeData("true");
        });
      }
    })
    .catch((error) => {
      $(this).find('i').css('display','none');
      console.log('here');
      const errorCode = error.code;
      const errorMessage = error.message;
      toastr.error('User Exists', 'Error!',{ timeOut: 9500 });
      // alert("userexists");
      // ..
    });
});


$("#skip").click(function () {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  $(this).find('i').css('display','block');
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      $(this).find('i').css('display','none');
      // Signed in
      const user = userCredential.user;
      localStorage.setItem('uid',user.uid);
      if (!user.emailVerified) {
         window.location.herf = "check_inbox.html";
        sendEmailVerification(auth.currentUser).then(() => {
          storeData("false");
        });
      }
    })
    .catch((error) => {
      $(this).find('i').css('display','none');
      console.log('here');
      const errorCode = error.code;
      const errorMessage = error.message;
      toastr.error('User Exists', 'Error!',{ timeOut: 9500 });
      // alert("userexists");
      // ..
    });
});

// logout
$("#logout").click(function () {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "login.html";
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    })
    .catch((error) => {
      toastr.error('No User Signed It', 'Error!',{ timeOut: 9500 })
      // alert("no user signed it");
    });
});

async function storeData(checkRefCode) {
  try {
    
    const docRef = await setDoc(doc(db, "users",localStorage.getItem('uid')), {
      email: localStorage.getItem("email"),
      coins: 0,
      refferalCode: Math.random().toString(36).substr(2, 7),
      userCoins:1
    });

    if(checkRefCode == "true")
    {
    const checkRefferal =  httpsCallable(functions, 'checkRefferalCode');
    await checkRefferal({refferalCode : refferal.value}).then((result) => 
    {
        console.log("called");
        
    });
    
}
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  window.location = "check_inbox.html";
 
}

// $("#account-body").ready(function () {
//   console.log("called");
//   displayData();
// });

async function displayData() {
  const docRef = doc(db, "users", localStorage.getItem("uid"));
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    const emailfront = docSnap.data();
    console.log(emailfront.email);
    document.getElementById("ref").innerHTML = emailfront.refferalCode;
    document.getElementById("emailfront").innerHTML =
      "Email: " + emailfront.email;
    document.getElementById("coins").innerHTML =
      "Total points collected: " + emailfront.coins; 
      document.getElementById("points").innerHTML =
      "Total coins collected: " + emailfront.userCoins;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
// call display data function when account page is open

let pathname=window.location.pathname;
if(pathname=='/account.html'){
  
  const tL =  httpsCallable(functions, 'getTopList');
       
  await tL().then((result) => {
    document.getElementById("hey").innerHTML = "Hey "+result.data.currentUserInfo.name +" !";
    document.getElementById("username").innerHTML = "Username: " +result.data.currentUserInfo.name;
    displayData();
  });
}
else if(pathname=='/account_ita.html'){
  displayData();
}
if(pathname == '/earn-more_ita.html')
{ 
  displayData();

 
  
}
else if(pathname == '/earn-more.html')
{ 
  displayData();
  
  
}

if(pathname == '/dashboard.html')
{ 
 
  getAuth().onAuthStateChanged(user =>{
    if(!user)
    {
      window.location = 'login.html';
    }
  })
  

  const tL =  httpsCallable(functions, 'getTopList');
       
  await tL().then((result) => 
  {
      console.log(result);
      console.log(result.data.currentUserInfo.postion);
      
      document.getElementById("firstEmail").innerHTML = result.data.top10Users[0].name;
      document.getElementById("firstPoints").innerHTML = result.data.top10Users[0].coins;
      document.getElementById("secondEmail").innerHTML = result.data.top10Users[1].name;
      document.getElementById("secondPoints").innerHTML = result.data.top10Users[1].coins;
      document.getElementById("thirdEmail").innerHTML = result.data.top10Users[2].name;
      document.getElementById("thirdPoints").innerHTML = result.data.top10Users[2].coins;
      document.getElementById("fourthEmail").innerHTML = result.data.top10Users[3].name;
      document.getElementById("fourthPoints").innerHTML = result.data.top10Users[3].coins;
      document.getElementById("userEmail").innerHTML = result.data.currentUserInfo.name;
      document.getElementById("userPoints").innerHTML = result.data.currentUserInfo.coins;
      document.getElementById("posUser").innerHTML = result.data.currentUserInfo.postion;
      document.getElementById("notifyPos").innerHTML = "Your position is "+result.data.currentUserInfo.postion +" in the list.";
  });

  

}





$("#forgor").click(function () {
  toastr.success('The link has been sent please wait', 'Success!',{ timeOut: 9500 })
  // alert("the link has been sent please wait");
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      toastr.success('Password reset sent', 'Success!',{ timeOut: 9500 })
      window.location.href = '/login.html'
      // alert("password reset sent");
    })
    .catch((error) => {
      console.log(error);
      // ..
    });
});
