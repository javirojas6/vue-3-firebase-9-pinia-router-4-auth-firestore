<template>
    <h1 class="text-center">Perfil de usuario</h1>
    <div class="text-center mb-5">
        <a-avatar 
            :src="userStore.userData.photoURL" 
            :size="100"
        ></a-avatar>
        
    </div>

    <a-row>
        <a-col :xs="{span:24}" :sm="{span: 12, offset: 6}">
            <a-form 
                name="basicPerfil" 
                autocomplete="off"
                layout="vertical"
                :model="userStore.userData"
                @finish="onFinish"
                >
                    <a-form-item
                        name="email"
                        label="Tú correo (no modificable)"
                        :rules="[{
                            required:true,
                            message:'Ingresa un email válido',
                            whitespace: true,
                            type:'email'
                            }]"
                    >
                        <a-input disabled v-model:value="userStore.userData.email">

                        </a-input>
                    </a-form-item>
                    <a-form-item
                        name="displayName"
                        label="Ingresa tu nickName"
                        :rules="[{
                            required:true,
                            message:'Ingresa un nick válido',
                            whitespace: true,
                            }]"
                    >
                        <a-input v-model:value="userStore.userData.displayName">

                        </a-input>
                    </a-form-item>
                    <a-upload 
                        
                        v-model:file-list="fileList"
                        list-type="picture"
                        :before-upload="beforeUpload"
                        :max-count="1"
                        @change="handleChange"
                        >
                        <a-button class="mb-5">Subir foto perfil</a-button>

                    </a-upload>
                    <a-form-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            :disabled="userStore.loadingUser"
                            :loading="userStore.loadingUser"
                            class="mt-5"
                        >
                            Actualizar Información
                        </a-button>
                    </a-form-item>

            </a-form>
        </a-col>
        
        
    </a-row>
</template>

<script setup>

import { useUserStore } from '../stores/user'
import { message } from 'ant-design-vue';
import { ref } from "vue";


const userStore = useUserStore()

const fileList = ref([])
const beforeUpload = (file) => {
    fileList.value = [...fileList.value, file];
    return false; //si no ponemoms false haŕá una solicitud post y dará error.
}

const handleChange = (info) => {
    // if (info.file.status !== "uploading") {
    //     const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('You can only upload JPG file!');
    //         handleRemove(info.file)
    //         return
    //     }
    //     const isLt2M = info.file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('Image must smaller than 2MB!');
    //         handleRemove(info.file)
    //         return
    //     }
    // }
}

const handleRemove = file => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const onFinish = async() => {
    const error =  await userStore.updateUser(userStore.userData.displayName, fileList.value[0])

    
    // fileList.value.forEach(file => {
    //     console.log(file)
    // });
    

    if (!error)
        return message.success('Se actualizó tu información de displayName')
    else 
        return message.error('ocurrió un error mientras guardamos tu información de displayName')
}

</script>

<style>
.mb-5{
    margin-bottom: 2rem;
}

.mt-5{
    margin-top: 2rem;
}
</style>