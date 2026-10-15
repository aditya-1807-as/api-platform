package com.example.apiplatform.dto.usage;

public interface EndpointUsageProjection {
    String getEndpoint();
    String getHttpMethod();
    Long getCount();
}
