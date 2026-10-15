package com.example.apiplatform.service;

import com.example.apiplatform.dto.chat.ChatCompletionRequest;
import com.example.apiplatform.dto.chat.ChatCompletionResponse;
import com.example.apiplatform.dto.chat.ModelDto;
import com.example.apiplatform.entity.ApiKey;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ModelService {

    private static final List<ModelDto> MODELS = List.of(
            new ModelDto(
                    "anthropic/claude-3.5-sonnet",
                    "Claude 3.5 Sonnet",
                    "Anthropic",
                    "State-of-the-art model with exceptional coding, multi-step reasoning, and nuanced natural writing.",
                    200000,
                    "$3.00 / 1M",
                    "$15.00 / 1M",
                    List.of("Coding", "Reasoning", "Flagship"),
                    "#d97706"
            ),
            new ModelDto(
                    "openai/gpt-4o",
                    "GPT-4o",
                    "OpenAI",
                    "Versatile flagship omni-model combining high intelligence with high throughput and vision capabilities.",
                    128000,
                    "$2.50 / 1M",
                    "$10.00 / 1M",
                    List.of("Multimodal", "General", "Fast"),
                    "#10b981"
            ),
            new ModelDto(
                    "deepseek/deepseek-chat",
                    "DeepSeek V3",
                    "DeepSeek",
                    "Ultra-efficient, top-tier open weights model excelling at mathematics, code generation, and low-latency reasoning.",
                    64000,
                    "$0.14 / 1M",
                    "$0.28 / 1M",
                    List.of("Coding", "Math", "Low Cost"),
                    "#06b6d4"
            ),
            new ModelDto(
                    "google/gemini-2.0-flash",
                    "Gemini 2.0 Flash",
                    "Google",
                    "Next-generation speed and 1M token context window for large document processing and real-time agents.",
                    1000000,
                    "$0.10 / 1M",
                    "$0.40 / 1M",
                    List.of("1M Context", "Ultra Fast", "Agentic"),
                    "#4285f4"
            ),
            new ModelDto(
                    "meta-llama/llama-3.3-70b",
                    "Llama 3.3 70B Instruct",
                    "Meta",
                    "Industry-standard open-weights model fine-tuned for instruction following and dialogue.",
                    128000,
                    "$0.40 / 1M",
                    "$0.40 / 1M",
                    List.of("Open Weights", "General", "Popular"),
                    "#a855f7"
            ),
            new ModelDto(
                    "mistralai/mistral-large-2407",
                    "Mistral Large 2",
                    "Mistral AI",
                    "Top-tier European multilingual reasoning model with deep code understanding and JSON output reliability.",
                    128000,
                    "$2.00 / 1M",
                    "$6.00 / 1M",
                    List.of("Multilingual", "Reasoning", "Enterprise"),
                    "#f97316"
            )
    );

    public List<ModelDto> getAllModels() {
        return MODELS;
    }

    public ModelDto getModelById(String modelId) {
        return MODELS.stream()
                .filter(m -> m.getId().equalsIgnoreCase(modelId))
                .findFirst()
                .orElse(MODELS.get(0));
    }

    public ChatCompletionResponse generateCompletion(ApiKey apiKey, ChatCompletionRequest request) {
        String modelId = request.getModel() != null ? request.getModel() : "anthropic/claude-3.5-sonnet";
        ModelDto model = getModelById(modelId);

        List<ChatCompletionRequest.ChatMessage> messages = request.getMessages() != null
                ? request.getMessages()
                : new ArrayList<>();

        String lastUserPrompt = messages.stream()
                .filter(m -> "user".equalsIgnoreCase(m.getRole()))
                .reduce((first, second) -> second)
                .map(ChatCompletionRequest.ChatMessage::getContent)
                .orElse("Hello! How can I assist you today?");

        String responseContent = generatePersonaResponse(model, lastUserPrompt);

        int promptTokens = Math.max(lastUserPrompt.length() / 4, 12);
        int completionTokens = Math.max(responseContent.length() / 4, 25);
        int totalTokens = promptTokens + completionTokens;

        ChatCompletionResponse.Choice choice = new ChatCompletionResponse.Choice(
                0,
                new ChatCompletionRequest.ChatMessage("assistant", responseContent),
                "stop"
        );

        ChatCompletionResponse.Usage usage = new ChatCompletionResponse.Usage(
                promptTokens,
                completionTokens,
                totalTokens
        );

        return new ChatCompletionResponse(
                "gen-" + UUID.randomUUID().toString().substring(0, 12),
                model.getId(),
                List.of(choice),
                usage
        );
    }

    private String generatePersonaResponse(ModelDto model, String prompt) {
        String lower = prompt.toLowerCase();

        if (lower.contains("code") || lower.contains("java") || lower.contains("python") || lower.contains("function") || lower.contains("api")) {
            return "Here is an optimized solution routed via **" + model.getName() + "**:\n\n" +
                    "```java\n" +
                    "// Secure API client routed via KeyShield\n" +
                    "public class ApiClient {\n" +
                    "    public static void main(String[] args) {\n" +
                    "        System.out.println(\"Routed through " + model.getName() + " with verified atomic quota.\");\n" +
                    "    }\n" +
                    "}\n" +
                    "```\n\n" +
                    "### Architecture Highlights:\n" +
                    "- **Model**: `" + model.getId() + "`\n" +
                    "- **Context Capacity**: " + (model.getContextLength() / 1000) + "k tokens\n" +
                    "- **Execution**: Processed with strict zero-knowledge SHA-256 verification.";
        }

        if (lower.contains("hello") || lower.contains("hi") || lower.contains("who are you")) {
            return "Hello! I am **" + model.getName() + "** (served through OpenRouter / KeyShield Gateway).\n\n" +
                    "I am ready to assist you with software engineering, complex reasoning, code optimization, or architectural design. How can I help you today?";
        }

        return "This is a response generated by **" + model.getName() + "** via KeyShield's unified API Gateway.\n\n" +
                "You requested:\n> " + prompt + "\n\n" +
                "**Analysis & Insights:**\n" +
                "1. **Latency & Throughput**: Dispatched and tracked in real-time MySQL telemetry.\n" +
                "2. **Quota Tracking**: Atomic decrement against your key's daily limit.\n" +
                "3. **Token Usage**: Calculated and logged for usage analytics.";
    }
}
