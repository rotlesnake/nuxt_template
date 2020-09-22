<template>
<v-app>
    <v-main>
        <nuxt />
    </v-main>
    
    <!-- ДИАЛОГ ОЖИДАНИЯ ЗАГРУЗКИ !-->
    <v-dialog v-model="$store.state.loader.visible" persistent width="300" :elevation="22" dark>
        <v-card class="pa-2">
            <v-card-text>{{$store.state.loader.text}}
                <v-progress-linear indeterminate color="white"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>

</v-app>
</template>

<script>
export default {
    data() {
        return {
            
        }
    }
}
</script>
