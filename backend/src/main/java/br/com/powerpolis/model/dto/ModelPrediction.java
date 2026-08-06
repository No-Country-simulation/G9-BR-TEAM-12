package br.com.powerpolis.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Resposta do serviço Python de IA (POST /predict) referente ao Contrato interno
 * contrato-api.md v0.7, seção 4: os 4 campos (categoria, probabilidade,
 * recomendacoes, custo_estimado_mensal) são todos calculados pelo Python,
 * não pelo Backend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModelPrediction {

    private String categoria;
    private Double probabilidade;
    private List<String> recomendacoes;
    private Double custoEstimadoMensal;
}