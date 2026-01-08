package com.example.demo.service;


import com.example.demo.model.ChatMessage;
import com.example.demo.repository.ChatRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatRepository repo;
    private final SimpMessagingTemplate template;

    public ChatService(ChatRepository repo,
                       SimpMessagingTemplate template) {
        this.repo = repo;
        this.template = template;
    }

    public void sendMessage(ChatMessage msg) {

        // REAL TIME SEND
        template.convertAndSendToUser(
                msg.getReceiver(),
                "/queue/messages",
                msg
        );

        // SAVE TO DB
        repo.save(msg);
    }
}
