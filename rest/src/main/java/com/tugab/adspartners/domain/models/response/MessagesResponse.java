package com.tugab.adspartners.domain.models.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class MessagesResponse {

    private List<String> messages;

    public MessagesResponse(String message) {
        this.messages = new ArrayList<>();
        this.messages.add(message);
    }
}
