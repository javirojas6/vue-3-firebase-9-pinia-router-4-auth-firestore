import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { defineStore } from 'pinia';
import { auth } from '../firebaseConfig';
import router from '../router';
import { useDatabaseStore } from './database';
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
                this.userData = {email: user.email,uid:user.uid}
                router.push('/');
                
            } catch(error) {
                console.log(error.code)
                return error.code
            }finally {
                this.loadingUser = false;
            }
        },
        async loginUser(email,password){
            this.loadingUser = true;
            try  {
                const {user} = await signInWithEmailAndPassword(auth,email,password);
                this.userData = { email: user.email, uid:user.uid };
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
                await signOut(auth);
                this.userData = null;
                console.log(this.userData)
                router.push('/login');
            } catch(error){
                console.log(error)
            }
        },
        currentUser() {
            return new Promise((resolve,reject)=> {
                const unsuscribe = onAuthStateChanged(auth,(user) => {
                    if(user){
                        this.userData = {email: user.email,uid:user.uid}
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