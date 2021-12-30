<template>
    <div>
     <form class="login" @submit.prevent="login">
        <label>User name</label>
        <input required v-model="username" ref="email_address" type="text" placeholder="Your Email Address" />
        <label>Password</label>
        <input required v-model="password" type="password" placeholder="Password"/>
        <hr />
        <button class="btn btn-primary" type="submit">Login</button>
      </form>
      </div>
    <a href="/register">Register</a>
</template>
<script>
export default{
    name:'Login',
    data(){
        return {
            username:"",
            password:""
        }
    },
    methods:{
        login(){
            const { username, password } = this;
            this.$store.dispatch('authenticateUser', { username, password }).then(() => {
                this.$router.push(this.$router.currentRoute.query.next_step);
            }).catch((err)=>{
                if (err === "Authentication failed"){
                this.password = "";
                this.error_message = "Authentication failed.<br />Please check your credentials";
                }
            });
        }
    }
}
</script>
<style scoped>
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
div form{
    text-align:left;
    margin:50px auto;
}
div.error_message{
  color:red;
  font-weight:bold;
  font-size:0.9em;
  text-align:center;
}
</style>