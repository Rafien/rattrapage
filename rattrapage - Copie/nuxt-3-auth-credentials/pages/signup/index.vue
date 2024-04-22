<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <label>
        Email:
        <input type="email" v-model="formData.email" required />
      </label>
      <label>
        Password:
        <input type="password" v-model="formData.password" required />
      </label>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>

const { signUp } = useAuth();
const formData = reactive({
  email: '',
  password: '',
});

const register = async () => {
  try {
    let res = await signUp({
      data: { ...formData },
    });

    console.log("res", res);
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>