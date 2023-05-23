<template>
    <h1 class="text-center">Register</h1>
    <a-row>
        <a-col :xs="{span:24}" :sm="{span: 12, offset: 6}">
            <a-form 
                name="basicLogin" 
                autocomplete="off"
                layout="vertical"
                :model="formState"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
                >
            
                <a-form-item
                        name="email"
                        label="Ingresa tu correo"
                        :rules="[{
                            required:true,
                            message:'Ingresa un email válido',
                            whitespace: true,
                            type:'email'
                            }]"
                    >
                    <a-input v-model:value="formState.email">

                    </a-input>
                </a-form-item>
                <a-form-item
                        name="password"
                        label="Ingresa contraseña"
                        :rules="[{
                            required:true, 
                            min:6, 
                            message:'Ingresa una contraseña con mínimo 6 caracteres',
                            whitespace: true
                            }]"
                    >
                        <a-input-password v-model:value="formState.password">

                        </a-input-password>

                </a-form-item>
                <a-form-item
                        name="repassword"
                        label="Repita contraseña"
                        :rules="[{
                            required:true, 
                            min:6, 
                            whitespace: true,
                            validator: validatePass,
                            }]"
                    >
                        <a-input-password v-model:value="formState.repassword">

                        </a-input-password>

                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :disabled="userStore.loadingUser"
                        :loading="userStore.loadingUser"
                    >
                    Crear Usuario
                    </a-button>
                </a-form-item>
            </a-form>
        </a-col>
</a-row>



    <!-- <div>
        <h1>Register</h1>
        <form @submit.prevent="handleSubmit">
            <input type="email" placeholder="Ingrese Email" v-model.trim="email">
            <input type="password" placeholder="Ingrese Contraseña" v-model.trim="password">
            <button type="submit" :disabled="userStore.loadingUser">Crear Usuario</button>
        </form>
    </div> -->
</template>

<script setup>
// import { ref } from "vue";
// import { useUserStore } from '../stores/user';

//     const userStore = useUserStore();
//     const email = ref('')
//     const password = ref('')
//     const handleSubmit = async() => {
//         if(!email.value || password.value.length < 5){
//             return alert('llena los campos')
//         }
//         await userStore.registerUser(email.value, password.value);

//     }



import { reactive, ref } from "vue";
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';

// const userStore = useUserStore();
//     const formState = reactive({
//         email: 'javi@gmail.com',
//         password: "123456"
//     });
//     const onFinish = async(values) => {
//       console.log('Success:', values);
//        await userStore.registerUser(email.value, password.value);
//     };

//     const onFinishFailed = (errorInfo) => {
//       console.log('Failed:', errorInfo);
//     };
const userStore = useUserStore();

const formState = reactive({
    email: "",
    password: "",
    repassword: "",
});

const validatePass = async(_rule,value) => {
    if (value === ''){
        return Promise.reject('Repita contraseña.')
    }
    if (value !== formState.password)
    {
        return Promise.reject('No coinciden las contraseñas.')
    }
    return Promise.resolve();
}

const onFinish = async(values) => {
    console.log('Success:', values);
    const error = await userStore.registerUser(formState.email, formState.password);
    if (!error){
        return message.success('Revisa tu correo electŕonico y verificalo');
    } 
    switch(error){
        case 'auth/email-already-in-use':
            message.error('Email ya registrado');
            break;
        default:
            message.error('fallo algo desde firebase. Intentelo nuevamente.')
            break;
    } 
    
};
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
</script>