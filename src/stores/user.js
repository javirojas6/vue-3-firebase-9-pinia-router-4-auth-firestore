import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification,
    onAuthStateChanged, 
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import { auth,db,storage } from '../firebaseConfig';
import { defineStore } from 'pinia';
import router from '../router';
import { useDatabaseStore } from './database';
import { getDownloadURL, ref,uploadBytes } from 'firebase/storage';
//un store o almacen
export const useUserStore = defineStore ('userStore',{
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false
    }),
    actions:{//aqui si modificamos el state
        async registerUser(email,password) {
            this.loadingUser = true;
            try {
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await sendEmailVerification(auth.currentUser)
                this.userData = {email: user.email,uid:user.uid}
                router.push('/');
                
            } catch(error) {
                console.log(error.code)
                return error.code
            }finally {
                this.loadingUser = false;
            }
        },
        async updateUser(displayName,imagen){
            this.loadingUser = true;
            try{
                if (imagen)
                {
                    console.log(imagen)
                    const storageRef = ref(storage,`perfiles/${this.userData.uid}`);
                    await uploadBytes(storageRef,imagen.originFileObj)
                    const photoURL = await getDownloadURL(storageRef)
                    await updateProfile (auth.currentUser,{
                     photoURL: photoURL
                    });
                    
                }
                await updateProfile (auth.currentUser,{
                    displayName: displayName
                });
               
                this.setUser(auth.currentUser)
            }catch(error){
                console.log(error)
                return error.code
            }finally{
                this.loadingUser = false;
            }
            
        },
        async setUser(user){
            try {
                const docRef = doc(db, "users", user.uid)
                
                this.userData = { 
                    email: user.email, 
                    uid:user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                };

                await setDoc(docRef, this.userData )  

                
            } catch (error){
                console.log(error)
            }
        },
        async loginUser(email,password){
            this.loadingUser = true;
            try  {
                const {user} = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await this.setUser(user)
                router.push('/');
            } catch (error){
                console.log(error.code)
                return error.code
            } finally {
                this.loadingUser = false;
            }

        },
        async logoutUser(){
            const databaseStore = useDatabaseStore();
            databaseStore.$reset();
            try {
                router.push('/login');
                await signOut(auth);
                this.userData = null;
                //console.log(this.userData)
                
            } catch(error){
                console.log(error)
            }
        },
        currentUser() {
            return new Promise((resolve,reject)=> {
                const unsuscribe = onAuthStateChanged(
                    auth,
                    async(user) => {
                        if(user){
                            console.log(user)
                            //await this.setUser(user)
                            this.userData = { 
                                email: user.email, 
                                uid:user.uid,
                                displayName: user.displayName,
                                photoURL: user.photoURL
                            };
                        } else {
                            this.userData = null;
                            const databaseStore = useDatabaseStore();
                            databaseStore.$reset();
                        }
                    resolve(user)
                }, e => reject(e))
                unsuscribe();
            })
        }
    }
});