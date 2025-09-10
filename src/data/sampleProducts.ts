import { Product } from '../types/entities';

export const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Inoculantes brasileiros para cana-de-açúcar
  {
    name: 'Masterfix L',
    brand: 'Stoller',
    category: 'inoculant',
    type: 'biological',
    registrationNumber: 'SP-39009-10004-7',
    mapaClassification: 'Inoculante Biológico',
    species: 'Azospirillum brasilense',
    guarantee: '1 x 10⁸ UFC/ml',
    physicalNature: 'fluid',
    activity: 'producer',
    fertilizerType: 'Inoculante para gramíneas',
    unitOfMeasure: 'L',
    costPerUnit: 85.50,
    packageSize: 1,
    supplier: 'Stoller do Brasil',
    manufacturer: 'Stoller do Brasil LTDA',
    applicationMethod: ['seed_treatment', 'foliar'],
    recommendedDosage: {
      min: 200,
      max: 500,
      unit: 'ml/ha'
    },
    targetCrops: ['sugar_cane'],
    description: 'Inoculante biológico à base de Azospirillum brasilense para promoção do crescimento de gramíneas',
    isActive: true
  },
  {
    name: 'Nitragin Cell Tech HC',
    brand: 'BASF',
    category: 'inoculant',
    type: 'biological',
    registrationNumber: 'MS-17007-10001-0',
    mapaClassification: 'Inoculante Biológico',
    species: 'Bradyrhizobium japonicum',
    guarantee: '5 x 10⁹ UFC/ml',
    physicalNature: 'fluid',
    activity: 'both',
    fertilizerType: 'Inoculante para leguminosas',
    unitOfMeasure: 'ml',
    costPerUnit: 0.12,
    packageSize: 400,
    supplier: 'BASF S.A.',
    manufacturer: 'BASF S.A.',
    applicationMethod: ['seed_treatment'],
    recommendedDosage: {
      min: 100,
      max: 200,
      unit: 'ml/100kg_seeds'
    },
    targetCrops: ['soy'],
    description: 'Inoculante líquido de alta concentração para fixação biológica de nitrogênio em soja',
    isActive: true
  },

  // Fertilizantes orgânicos
  {
    name: 'BioFert NPK 4-14-8',
    brand: 'Geociclo',
    category: 'fertilizer',
    type: 'organic',
    registrationNumber: 'SP-00504-40007-2',
    mapaClassification: 'Fertilizante Orgânico Composto',
    activeIngredient: 'Matéria orgânica compostada',
    concentration: 'N: 4%, P₂O₅: 14%, K₂O: 8%',
    formulationType: 'granular',
    unitOfMeasure: 'kg',
    costPerUnit: 2.45,
    packageSize: 25,
    supplier: 'Geociclo Tecnologia Ambiental',
    manufacturer: 'Geociclo Tecnologia Ambiental LTDA',
    applicationMethod: ['soil'],
    recommendedDosage: {
      min: 300,
      max: 800,
      unit: 'kg/ha'
    },
    targetCrops: ['sugar_cane', 'corn', 'soy'],
    toxicClass: 'NT',
    environmentalClass: 'IV',
    description: 'Fertilizante orgânico granulado obtido por compostagem de resíduos orgânicos',
    isActive: true
  },

  // Corretivos de solo
  {
    name: 'Calcário Dolomítico Filler',
    brand: 'Cal Norte',
    category: 'soil_corrector',
    type: 'mineral',
    registrationNumber: 'SP-11234-50001-8',
    mapaClassification: 'Corretivo de Acidez',
    activeIngredient: 'CaCO₃ + MgCO₃',
    concentration: 'PRNT: 85%, CaO: 32%, MgO: 15%',
    formulationType: 'powder',
    unitOfMeasure: 't',
    costPerUnit: 180.00,
    packageSize: 1,
    supplier: 'Cal Norte Mineração',
    manufacturer: 'Cal Norte Mineração LTDA',
    applicationMethod: ['soil'],
    recommendedDosage: {
      min: 1.0,
      max: 3.0,
      unit: 't/ha'
    },
    targetCrops: ['sugar_cane', 'corn', 'soy', 'pasture'],
    toxicClass: 'NT',
    environmentalClass: 'IV',
    description: 'Calcário dolomítico finamente moído para correção da acidez do solo',
    isActive: true
  },

  // Herbicidas
  {
    name: 'Combine 500 SC',
    brand: 'Syngenta',
    category: 'herbicide',
    type: 'chemical',
    registrationNumber: 'SP-30890-30005-1',
    mapaClassification: 'Herbicida Seletivo',
    activeIngredient: 'Ametryn + Trifloxysulfuron-sodium',
    concentration: 'Ametryn: 400 g/L + Trifloxysulfuron: 100 g/L',
    formulationType: 'suspension',
    unitOfMeasure: 'L',
    costPerUnit: 125.80,
    packageSize: 1,
    supplier: 'Syngenta Proteção de Cultivos',
    manufacturer: 'Syngenta Proteção de Cultivos LTDA',
    applicationMethod: ['foliar'],
    recommendedDosage: {
      min: 1.2,
      max: 2.0,
      unit: 'L/ha'
    },
    targetCrops: ['sugar_cane'],
    targetPests: ['Brachiaria decumbens', 'Digitaria horizontalis', 'Eleusine indica'],
    toxicClass: '3',
    environmentalClass: 'II',
    withdrawalPeriod: 150,
    reentryPeriod: 12,
    description: 'Herbicida pós-emergente seletivo para controle de plantas daninhas em cana-de-açúcar',
    technicalDataSheet: 'https://example.com/combine500sc_bula.pdf',
    safetyDataSheet: 'https://example.com/combine500sc_fispq.pdf',
    isActive: true
  },

  // Inseticidas biológicos
  {
    name: 'Agree WG',
    brand: 'Certis',
    category: 'insecticide',
    type: 'biological',
    registrationNumber: 'SP-98765-60001-3',
    mapaClassification: 'Inseticida Microbiológico',
    activeIngredient: 'Bacillus thuringiensis',
    species: 'Bacillus thuringiensis var. aizawai',
    concentration: '12% p/p',
    formulationType: 'powder',
    guarantee: '1.2 x 10¹⁰ UFC/g',
    physicalNature: 'solid',
    unitOfMeasure: 'kg',
    costPerUnit: 280.50,
    packageSize: 1,
    supplier: 'Certis Biologicals',
    manufacturer: 'Certis Biologicals Brasil LTDA',
    applicationMethod: ['foliar'],
    recommendedDosage: {
      min: 0.5,
      max: 1.0,
      unit: 'kg/ha'
    },
    targetCrops: ['sugar_cane', 'corn', 'soy', 'cotton'],
    targetPests: ['Diatraea saccharalis', 'Spodoptera frugiperda'],
    toxicClass: 'NT',
    environmentalClass: 'III',
    withdrawalPeriod: 3,
    reentryPeriod: 4,
    description: 'Inseticida biológico à base de Bacillus thuringiensis para controle de lagartas',
    isActive: true
  },

  // Adjuvantes
  {
    name: 'Silwet L-77',
    brand: 'Momentive',
    category: 'adjuvant',
    type: 'chemical',
    registrationNumber: 'SP-55432-90001-7',
    mapaClassification: 'Adjuvante Espalhante-Adesivo',
    activeIngredient: 'Trisiloxano etoxilado',
    concentration: '100% p/p',
    formulationType: 'liquid',
    unitOfMeasure: 'L',
    costPerUnit: 95.75,
    packageSize: 1,
    supplier: 'Momentive Performance Materials',
    manufacturer: 'Momentive Performance Materials Brasil LTDA',
    applicationMethod: ['foliar'],
    recommendedDosage: {
      min: 0.05,
      max: 0.25,
      unit: 'L/ha'
    },
    targetCrops: ['sugar_cane', 'corn', 'soy', 'citrus'],
    toxicClass: '4',
    environmentalClass: 'III',
    description: 'Adjuvante surfactante para melhorar a eficácia de pulverizações foliares',
    notes: 'Não aplicar com chuva ou alta umidade relativa',
    isActive: true
  },

  // Bioestimulantes
  {
    name: 'Stimulate Mo',
    brand: 'Stoller',
    category: 'biostimulant',
    type: 'organic',
    registrationNumber: 'GO-78901-70001-5',
    mapaClassification: 'Bioestimulante Vegetal',
    activeIngredient: 'Ácido indolbutírico + Cinetina + Ácido giberélico',
    concentration: 'AIB: 0.005% + CIN: 0.009% + GA₃: 0.005%',
    formulationType: 'liquid',
    unitOfMeasure: 'L',
    costPerUnit: 185.20,
    packageSize: 1,
    supplier: 'Stoller do Brasil',
    manufacturer: 'Stoller do Brasil LTDA',
    applicationMethod: ['seed_treatment', 'foliar'],
    recommendedDosage: {
      min: 250,
      max: 750,
      unit: 'ml/ha'
    },
    targetCrops: ['sugar_cane', 'corn', 'soy', 'beans'],
    toxicClass: 'NT',
    environmentalClass: 'IV',
    description: 'Bioestimulante com reguladores de crescimento para desenvolvimento radicular e vegetativo',
    isActive: true
  }
];

// Função para inserir dados de exemplo
export const insertSampleProducts = async () => {
  const { ProductRepository } = await import('../database/models/ProductRepository');
  
  console.log('Inserindo produtos de exemplo...');
  
  for (const product of sampleProducts) {
    try {
      await ProductRepository.create(product);
      console.log(`✓ Produto criado: ${product.name}`);
    } catch (error) {
      console.error(`✗ Erro ao criar produto ${product.name}:`, error);
    }
  }
  
  console.log('Inserção de produtos de exemplo concluída');
};