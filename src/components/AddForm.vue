<script setup>
import { reactive } from "vue";
import { useDatabaseStore } from "../stores/database";
import { message } from 'ant-design-vue';

    const databaseStore = useDatabaseStore()

    const formState = reactive({
        url: ''
    })

    const onFinish = async(value) => {
        console.log('todo correcto' + value)
        const error = await databaseStore.addUrl(formState.url)
        if (!error){
            formState.url = "";
            return message.success('Url agregada.')
        }

        switch(error){
            //buscar errores de firestore
            default:
                message.error('fallo algo desde firebase. Intentelo nuevamente.')
                break;
        } 
    }
</script>


<template>
    <a-form
        name="addform"
        autocomplete="off"
        layout="vertical"
        :model="formState"
        @finish="onFinish"
    >
        <a-form-item
            name="url"
            label="Ingresar una Url"
            :rules="[{
                required: true,
                whitespace:true,
                pattern:/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                message:'Ingrese una url válida.'
            }]"
        >
            <a-input v-model:value="formState.url"></a-input>
        </a-form-item>

        <a-form-item>
            <a-button
                type="primary"
                html-type="submit"
                :disabled="databaseStore.loading"
                :loading="databaseStore.loading"
                >Agregar URL
            </a-button>
        </a-form-item>
    </a-form>
</template>

