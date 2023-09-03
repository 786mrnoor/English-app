import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
// signup login
import { updateProfile, onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDFK7CVl0uLr8B5o4JQ8dAfEsL4LEwFMr8",
    authDomain: "crud-7302b.firebaseapp.com",
    databaseURL: "https://crud-7302b-default-rtdb.firebaseio.com",
    projectId: "crud-7302b",
    storageBucket: "crud-7302b.appspot.com",
    messagingSenderId: "112669465268",
    appId: "1:112669465268:web:a5a323f6f13e8a379415e1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage();

function InsertData(data, adrs, setData, setLoad) {
    set(ref(db, adrs + "/" + data.id), data)
        .then(() => {
            getAllData(adrs, setData, setLoad)
        })
        .catch((err) => {
            alert('error');
            console.log(err.code);
            console.log(err.message);
        })
}

function getAllData(adrs, setData, setLoad) {
    get(child(ref(db), adrs)).then((data) => {
        let dataArr = [];
        data.forEach(item => {
            dataArr.push(item.val())
        })
        setLoad(false);
        setData(dataArr.sort((a, b) => {
            let a1 = new Date(JSON.parse(a.time))
            let b1 = new Date(JSON.parse(b.time))

            return b1 - a1
        }))
    })
        .catch(err => {
            console.log(err.code);
            console.log(err.message);
            if (err.message == 'Permission denied') {
                // logout();
            }
        })
}

function updateData(data, id, adrs, setData, setLoad) {
    update(ref(db, adrs + "/" + id), data)
        .then(() => {
            getAllData(adrs, setData, setLoad)
        })
        .catch((err) => {
            alert('error', err);
        })
}
function deleteData(id, adrs, setData, setLoad) {
    remove(ref(db, adrs + "/" + id))
        .then(() => {
            getAllData(adrs, setData, setLoad)
        })
        .catch((err) => {
            alert('error', err);
        })
}

function existData(adrs, id, setTopic, setData, setLoad, navigate) {
    const dbRef = ref(db);
    get(child(dbRef, adrs))
        .then((data) => {
            if (data.exists()) {
                setTopic(data.val())
                getAllData(`Questions/${id}`, setData, setLoad);
            }
            else {
                navigate('/');
            }
        })
}

function updateMultipleData(data, adrs, setData, setLoad) {
    update(ref(db), data)
        .then(() => {
            getAllData(adrs, setData, setLoad);
        })
        .catch((err) => {
            alert('error', err);
        })
}




//login signup logout
const auth = getAuth(app);

function signup(obj) {
    createUserWithEmailAndPassword(auth, obj.email, obj.pass)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(auth.currentUser, {
                displayName: obj.name
            })
                .then(() => {
                    window.location.href = 'index.html';
                }).catch((error) => {

                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode);
            console.log(errorMessage);
        });
}

function login(email, password, showError) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = 'index.html';
        })
        .catch((error) => {
            showError(error)
        });
}
function logout() {
    signOut(auth).then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.log('An error happened.')
    });
}

function getData(adrs, setData) {
    get(child(ref(db), adrs))
        .then((data) => {
            if (data.exists()) {
                setData(data.val())
            }
            else {
                alert('data not found')
            }
        })
        .catch(err => {
            console.log(err.message);
        })

}


function getCurrentUser(setUser) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser('login', auth.currentUser);
        } 
        else {
            setUser('logout');
        }
    });
}


function resetPassword() {
    updatePassword(user, newPassword)
        .then(() => {
            // Update successful.
        }).catch((error) => {
            // An error ocurred
            // ...
        });
}

function profilePicUpload(id, file, setImage, showLoader) {
    uploadBytes(sRef(storage, `usersPic/${id}`), file)
        .then((snapshot) => {
            getDownloadURL(sRef(storage, `usersPic/${id}`))
            .then((url)=>{
                updateProfile(auth.currentUser, {
                    photoURL: url
                })
                    .then(() => {
                        showLoader(false);
                        setImage(auth.currentUser);
                    }).catch((error) => {
    
                    });
            })
        })
        .catch(err=>{
            console.log(err.code);
            console.log(err.message);
        })
}


function uniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export { profilePicUpload, getCurrentUser, resetPassword, logout, getData, login, signup, InsertData, getAllData, updateData, deleteData, existData, updateMultipleData, uniqueId };


