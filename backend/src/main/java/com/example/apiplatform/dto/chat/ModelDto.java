package com.example.apiplatform.dto.chat;

import java.util.List;

public class ModelDto {

    private String id;
    private String name;
    private String provider;
    private String description;
    private int contextLength;
    private String pricingPrompt;
    private String pricingCompletion;
    private List<String> tags;
    private String badgeColor;

    public ModelDto() {}

    public ModelDto(String id, String name, String provider, String description,
                    int contextLength, String pricingPrompt, String pricingCompletion,
                    List<String> tags, String badgeColor) {
        this.id = id;
        this.name = name;
        this.provider = provider;
        this.description = description;
        this.contextLength = contextLength;
        this.pricingPrompt = pricingPrompt;
        this.pricingCompletion = pricingCompletion;
        this.tags = tags;
        this.badgeColor = badgeColor;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getContextLength() {
        return contextLength;
    }

    public void setContextLength(int contextLength) {
        this.contextLength = contextLength;
    }

    public String getPricingPrompt() {
        return pricingPrompt;
    }

    public void setPricingPrompt(String pricingPrompt) {
        this.pricingPrompt = pricingPrompt;
    }

    public String getPricingCompletion() {
        return pricingCompletion;
    }

    public void setPricingCompletion(String pricingCompletion) {
        this.pricingCompletion = pricingCompletion;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getBadgeColor() {
        return badgeColor;
    }

    public void setBadgeColor(String badgeColor) {
        this.badgeColor = badgeColor;
    }
}
