package com.example.demo.controller;


import com.example.demo.model.ChatMessage;
import com.example.demo.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatWebSocketController {

    private final ChatService service;

    public ChatWebSocketController(ChatService service) {
        this.service = service;
    }

    @MessageMapping("/chat")
    public void chat(ChatMessage msg, Principal principal) {

        msg.setSender(principal.getName());
        msg.setTime(LocalDateTime.now());

        service.sendMessage(msg);
    }
}
