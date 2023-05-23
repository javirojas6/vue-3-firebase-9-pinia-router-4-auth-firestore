<template>
    <div>
        <h1>Home Ruta Protegida</h1>
        <p>{{ userStore.userData?.email }}</p>

        <add-form></add-form>

        <!-- <form @submit.prevent="handleSubmit">
            <input type="text" placeholder="Ingrese URL" v-model="url">
            <button type="submit">Agregar</button>

        </form> -->
        <p v-if="databaseStore.loadingDoc">loading docs...</p>
        <a-space 
            direction="vertical" 
            v-if="!databaseStore.loadingDoc" 
            style="width: 100%">
            <a-card
                v-for="item of databaseStore.documents" 
                :key="item.id"
                :title="item.short"
            >
            <template #extra>
                <a-space>
                    <a-popconfirm
                        title="Estás seguro que deseas eliminar?"
                        ok-text="Si"
                        cancel-text="No"
                        @confirm = "confirm(item.id)"
                        @cancel = "cancel"
                    >
                    <a-button 
                        danger 
                        :disabled="databaseStore.loading"
                        :loading="databaseStore.loading"
                        >Eliminar</a-button>
                    </a-popconfirm>
                    
                    <a-button type="primary" @click="router.push(`editar/${item.id}`)">Editar</a-button>
                </a-space>
            </template>
            <p>{{ item.name }}</p>

            </a-card>
        </a-space>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/user';
//import { ref } from 'vue';
import { useDatabaseStore } from '../stores/database';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();
databaseStore.getUrls();

const confirm = async(id) => {
    console.log('hola')
    const error = await databaseStore.deleteUrl(id)
    if (!error) 
        return message.success('se eliminó con éxito')
    return message.error(error)
}

const cancel = () => {
    message.error('no se eliminó')
}

// const url = ref('');
// const handleSubmit = () => {
//     //validaciones de esa url...
//     databaseStore.addUrl(url.value)
// }

// console.log(userStore.userData)
</script>

