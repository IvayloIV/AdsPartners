package com.tugab.adspartners.domain.models.response.common;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class ErrorResponse {

    private List<String> messages;

    public ErrorResponse(String message) {
        this.messages = new ArrayList<>();
        this.messages.add(message);
    }
}
