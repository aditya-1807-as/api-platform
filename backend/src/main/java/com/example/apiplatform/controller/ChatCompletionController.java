package com.example.apiplatform.controller;

import com.example.apiplatform.dto.chat.ChatCompletionRequest;
import com.example.apiplatform.dto.chat.ChatCompletionResponse;
import com.example.apiplatform.dto.chat.ModelDto;
import com.example.apiplatform.dto.common.ApiResponse;
import com.example.apiplatform.entity.ApiKey;
import com.example.apiplatform.security.ApiKeyAuthenticationFilter;
import com.example.apiplatform.service.ModelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "AI Chat & Models", description = "OpenAI & OpenRouter compatible chat completions and model catalog")
public class ChatCompletionController {

    private final ModelService modelService;

    public ChatCompletionController(ModelService modelService) {
        this.modelService = modelService;
    }

    @GetMapping("/models")
    @Operation(summary = "List all available AI models supported by the router")
    public ResponseEntity<ApiResponse<List<ModelDto>>> getModels() {
        return ResponseEntity.ok(ApiResponse.success(modelService.getAllModels()));
    }

    @PostMapping("/chat/completions")
    @Operation(summary = "Create chat completion (OpenAI & OpenRouter compliant)", parameters = {
            @Parameter(name = "X-API-Key", in = ParameterIn.HEADER, required = false, description = "Client API Key (or Authorization: Bearer <key>)")
    })
    public ResponseEntity<ChatCompletionResponse> createChatCompletion(
            HttpServletRequest servletRequest,
            @RequestBody ChatCompletionRequest request) {

        ApiKey apiKey = (ApiKey) servletRequest.getAttribute(ApiKeyAuthenticationFilter.CURRENT_API_KEY_ATTR);
        ChatCompletionResponse response = modelService.generateCompletion(apiKey, request);
        return ResponseEntity.ok(response);
    }
}
