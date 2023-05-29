<template>
    <h1 class="text-center">Login</h1>
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
                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            :disabled="userStore.loadingUser"
                            :loading="userStore.loadingUser"
                        >
                            Ingresar
                        </a-button>
                    </a-form-item>

            </a-form>
        </a-col>
        
        
    </a-row>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from '../stores/user';
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css';
//import { useRouter } from 'vue-router';

    const userStore = useUserStore();
    const formState = reactive({
        email: 'javi@gmail.com',
        password: "123456"
    });
    const onFinish = async(values) => {
        //console.log('Success:', values);
        const error = await userStore.loginUser(formState.email, formState.password);
        if (!error){
            return message.success('Bienvenidos a la super app');
        } 
        switch(error){
            case 'auth/user-not-found':
                message.error('No existe esa cuenta');
                break;
            case 'auth/wrong-password':
                message.error('Error de contraseña')
                break;
            default:
                message.error('fallo algo desde firebase. Intentelo nuevamente.')
                break;
        } 
    };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    //const router = useRouter();
    // const email = ref('javi@gmail.com')
    // const password = ref('123456')
    // const handleSubmit = async() => {
    //     // if(!email.value || password.value.length < 5){
    //     //     return alert('llena los campos')
    //     // }
    //     await userStore.loginUser(formState.email, formState.password);
    //     //router.push('/');
    // }
    
</script>