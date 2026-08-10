package br.com.powerpolis.service;

import br.com.powerpolis.model.dto.AnaliseEnergeticaRequest;
import br.com.powerpolis.model.dto.ModelPrediction;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.net.http.HttpClient;

/**
 * Cliente do serviço de IA (Python/FastAPI). Contrato interno documentado
 * em contrato-api.md v0.7, seção 4  sobre endpoint POST /predict.
 */


@Component
public class ModelServiceClient {

    private final RestClient restClient;

    public ModelServiceClient(@Value("${model-service.url}") String modelServiceUrl) {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        this.restClient = RestClient.builder()
                .baseUrl(modelServiceUrl)
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    public ModelPrediction prever(AnaliseEnergeticaRequest request) {
        try {
            return restClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ModelPrediction.class);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Serviço de IA indisponível no momento",
                    e
            );
        }
    }
}