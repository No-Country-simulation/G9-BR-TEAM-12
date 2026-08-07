package br.com.powerpolis.service;

import br.com.powerpolis.model.dto.AnaliseEnergeticaRequest;
import br.com.powerpolis.model.dto.AnaliseEnergeticaResponse;
import br.com.powerpolis.model.dto.ModelPrediction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Orquestra a análise energética. Por decisão registrada em
 * contrato-api.md v0.7, categoria, probabilidade, recomendacoes e
 * custo_estimado_mensal são inteiramente calculados pela Data Science —
 * o Backend só valida a entrada e repassa a resposta do serviço de IA.
 */
@Service
@RequiredArgsConstructor
public class AnaliseEnergeticaService {

    private final ModelServiceClient modelServiceClient;

    public AnaliseEnergeticaResponse analisar(AnaliseEnergeticaRequest request) {
        ModelPrediction prediction = modelServiceClient.prever(request);

        return new AnaliseEnergeticaResponse(
                prediction.getCategoria(),
                prediction.getProbabilidade(),
                prediction.getRecomendacoes(),
                prediction.getCustoEstimadoMensal()
        );
    }

    public AnaliseEnergeticaResponse consultarPorId(String id) {
        // Depende de persistência no Autonomous Database — ver pendências.
        throw new UnsupportedOperationException("Consulta por id ainda não implementada");
    }
}