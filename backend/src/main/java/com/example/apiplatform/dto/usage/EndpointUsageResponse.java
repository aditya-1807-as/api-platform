package com.example.apiplatform.dto.usage;

public class EndpointUsageResponse {

    private String endpoint;
    private String httpMethod;
    private Long count;

    public EndpointUsageResponse() {
    }

    public EndpointUsageResponse(String endpoint, String httpMethod, Long count) {
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.count = count;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getHttpMethod() {
        return httpMethod;
    }

    public void setHttpMethod(String httpMethod) {
        this.httpMethod = httpMethod;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
