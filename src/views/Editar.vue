<template>
  <div>
    <h1>Editar id: {{route.params.id}}</h1>

    <a-form
        name="editform"
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
            <a-space>
                <a-button
                    type="primary"
                    html-type="submit"
                    :disabled="databaseStore.loading"
                    :loading="databaseStore.loading"
                    >Edit URL
                </a-button>
            
            
                <a-button
                    type="primary"
                    @click="onBack"
                    :disabled="databaseStore.loading"
                    :loading="databaseStore.loading"
                    >Volver
                </a-button>
            </a-space>
        </a-form-item>
    </a-form>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { onMounted,ref } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { reactive } from "vue";
import { message } from 'ant-design-vue';


const databaseStore = useDatabaseStore();

const route = useRoute();
const router = useRouter();
const formState = reactive({
        url: ''
})
// console.log(route.params.id)

const onFinish = async(value) => {
    console.log('todo correcto' + value)
    const error = await databaseStore.updateUrl(route.params.id,formState.url)
    if (!error){
        formState.url = "";
        return message.success('Url editada.')
    }

    switch(error){
        //buscar errores de firestore
        default:
            message.error('fallo algo desde firebase. Intentelo nuevamente.')
            break;
    } 
}

const onBack = async(next) => {
    console.log(route)
    router.push(`/`)
}

onMounted(async() => {
    formState.url = await databaseStore.leerUrl(route.params.id);
})

</script>

<style>

</style>