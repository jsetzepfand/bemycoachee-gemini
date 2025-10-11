<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useChatStore } from '../stores/chat';
import ChatMessage from '../components/ChatMessage.vue';

const chatStore = useChatStore();
const newMessage = ref('');
const messageContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  chatStore.fetchMessages().then(() => {
    scrollToBottom();
  });
});

const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;
  const text = newMessage.value;
  newMessage.value = '';
  await chatStore.addMessage(text);
  scrollToBottom();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};
</script>

<template>
  <div class="chat-container">
    <div class="messages-window" ref="messageContainer">
      <div v-if="chatStore.isLoading && chatStore.messages.length === 0" class="loading-overlay">
        <p>Loading conversation...</p>
      </div>
      <div v-else-if="chatStore.error" class="error-message">
        <p>Error: {{ chatStore.error }}</p>
      </div>
      <div v-else>
        <ChatMessage v-for="(msg, index) in chatStore.messages" :key="index" :msg="msg" />
      </div>
    </div>
    <div class="input-area">
      <form @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          :disabled="chatStore.isLoading"
        />
        <button type="submit" :disabled="chatStore.isLoading">
          {{ chatStore.isLoading ? 'Sending...' : 'Send' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px); /* Adjust based on your layout */
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.messages-window {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.loading-overlay, .error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-style: italic;
  color: #888;
}

.input-area {
  padding: 1rem;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.input-area form {
  display: flex;
}

.input-area input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 1rem;
}

.input-area button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}

.input-area button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
</style>
