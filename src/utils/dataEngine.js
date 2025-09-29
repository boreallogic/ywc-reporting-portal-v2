// Standardized Data Collection Engine
// This engine transforms subjective reporting into quantitative, comparable data

/**
 * Field Types for Standardized Data Collection
 */
export const FieldTypes = {
  // Quantitative Fields
  NUMBER: 'number',           // Staff count, client count, etc.
  CURRENCY: 'currency',       // Funding amounts
  PERCENTAGE: 'percentage',   // Calculated percentages
  SCALE: 'scale',            // 1-5 ratings, difficulty scales
  
  // Standardized Options
  RADIO: 'radio',            // Single choice from predefined options
  CHECKBOX: 'checkbox',      // Multiple choice from predefined options  
  DROPDOWN: 'dropdown',      // Single choice from long list
  
  // Calculated Fields
  CALCULATED: 'calculated',  // Auto-calculated from other inputs
  RATIO: 'ratio',           // Auto-calculated ratios
  
  // Minimal Text
  TEXT_SHORT: 'text_short', // Brief, structured text (max 100 chars)
  
  // Date/Time
  DATE: 'date',             // Standardized date format
  PERIOD: 'period'          // Reporting period selector
};

/**
 * Standardized Response Libraries
 * Pre-defined options ensure consistency across organizations
 */
export const StandardOptions = {
  difficulty: [
    { value: 'not_difficult', label: 'Not difficult' },
    { value: 'somewhat_difficult', label: 'Somewhat difficult' },
    { value: 'very_difficult', label: 'Very difficult' },
    { value: 'not_applicable', label: 'Not applicable' }
  ],
  
  yesNoNA: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
    { value: 'not_applicable', label: 'Not applicable' }
  ],
  
  satisfactionScale: [
    { value: 1, label: 'Very Dissatisfied' },
    { value: 2, label: 'Dissatisfied' },
    { value: 3, label: 'Neutral' },
    { value: 4, label: 'Satisfied' },
    { value: 5, label: 'Very Satisfied' }
  ],
  
  boardCompensation: [
    { value: 'per_meeting', label: 'Per-meeting stipend' },
    { value: 'monthly', label: 'Monthly honorarium' },
    { value: 'annual', label: 'Annual honorarium' },
    { value: 'travel', label: 'Travel reimbursement' },
    { value: 'childcare', label: 'Childcare reimbursement' },
    { value: 'gifts', label: 'Gift cards or tokens' },
    { value: 'other', label: 'Other (specify)' }
  ],
  
  collaborationTypes: [
    { value: 'co_programming', label: 'Co-delivered programming or services' },
    { value: 'joint_funding', label: 'Joint funding proposals or reports' },
    { value: 'shared_advocacy', label: 'Shared advocacy or policy initiatives' },
    { value: 'events', label: 'Attended shared events or working groups' },
    { value: 'coordination', label: 'Regular coordination or planning' },
    { value: 'resource_sharing', label: 'Resource sharing (space, staff, tools)' },
    { value: 'other', label: 'Other (specify)' }
  ],
  
  disclosureChannels: [
    { value: 'annual_report', label: 'Annual report' },
    { value: 'agm_documents', label: 'AGM documents' },
    { value: 'audited_financials', label: 'Audited financials' },
    { value: 'website', label: 'Website' },
    { value: 'other', label: 'Other (specify)' }
  ],
  
  auditTypes: [
    { value: 'full_audit', label: 'Full financial audit (by external auditor)' },
    { value: 'review_engagement', label: 'Financial review engagement (by external accountant)' },
    { value: 'internal_review', label: 'Internal financial review by board or finance committee' },
    { value: 'other', label: 'Other (specify)' }
  ]
};

/**
 * Automated Calculation Engine
 */
export const Calculations = {
  // Staff turnover rate: (staff who left / average staff count) × 100
  turnoverRate: (staffLeft, averageStaff) => {
    if (!averageStaff || averageStaff === 0) return 0;
    return Math.round((staffLeft / averageStaff) * 100);
  },
  
  // Funding ratios
  fundingRatio: (nonCore, core) => {
    if (!core || core === 0) return 0;
    return Math.round((nonCore / core) * 100) / 100; // 2 decimal places
  },
  
  corePercentage: (core, total) => {
    if (!total || total === 0) return 0;
    return Math.round((core / total) * 100);
  },
  
  // Average calculation
  average: (values) => {
    const validValues = values.filter(v => v != null && !isNaN(v));
    if (validValues.length === 0) return 0;
    return Math.round((validValues.reduce((sum, val) => sum + val, 0) / validValues.length) * 100) / 100;
  },
  
  // Growth rate calculation
  growthRate: (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }
};

/**
 * Data Validation Rules
 */
export const ValidationRules = {
  // Percentage must be 0-100
  percentage: (value) => {
    if (value < 0) return "Percentage cannot be negative";
    if (value > 100) return "Percentage cannot exceed 100%";
    return null;
  },
  
  // Currency must be non-negative
  currency: (value) => {
    if (value < 0) return "Amount cannot be negative";
    return null;
  },
  
  // Staff count must be non-negative integer
  staffCount: (value) => {
    if (value < 0) return "Staff count cannot be negative";
    if (!Number.isInteger(value)) return "Staff count must be a whole number";
    return null;
  },
  
  // Required field validation
  required: (value) => {
    if (value == null || value === '' || value === undefined) {
      return "This field is required";
    }
    return null;
  },
  
  // Scale validation (1-5)
  scale: (value, min = 1, max = 5) => {
    if (value < min || value > max) {
      return `Value must be between ${min} and ${max}`;
    }
    return null;
  }
};

/**
 * Field Configuration Factory
 * Creates standardized field configurations based on indicator patterns
 */
export const createFieldConfig = (indicatorName, measurementMethod) => {
  const name = indicatorName.toLowerCase();
  const method = measurementMethod?.toLowerCase() || '';
  
  // Staff turnover indicators
  if (name.includes('turnover') || name.includes('retention')) {
    return {
      type: 'calculated_group',
      fields: [
        {
          key: 'staffAtStart',
          type: FieldTypes.NUMBER,
          label: 'Staff count at period start',
          validation: [ValidationRules.required, ValidationRules.staffCount],
          placeholder: 'e.g., 12'
        },
        {
          key: 'staffAtEnd',
          type: FieldTypes.NUMBER,
          label: 'Staff count at period end',
          validation: [ValidationRules.required, ValidationRules.staffCount],
          placeholder: 'e.g., 10'
        },
        {
          key: 'staffLeft',
          type: FieldTypes.NUMBER,
          label: 'Number of staff who left during period',
          validation: [ValidationRules.required, ValidationRules.staffCount],
          placeholder: 'e.g., 3'
        }
      ],
      calculations: [
        {
          key: 'averageStaff',
          formula: (data) => Math.round((data.staffAtStart + data.staffAtEnd) / 2),
          label: 'Average staff count'
        },
        {
          key: 'turnoverRate',
          formula: (data) => Calculations.turnoverRate(data.staffLeft, data.averageStaff),
          label: 'Turnover rate (%)',
          format: 'percentage'
        }
      ]
    };
  }
  
  // Funding indicators
  if (name.includes('funding') && (name.includes('ratio') || name.includes('core'))) {
    return {
      type: 'calculated_group',
      fields: [
        {
          key: 'coreFunding',
          type: FieldTypes.CURRENCY,
          label: 'Total core funding ($)',
          validation: [ValidationRules.required, ValidationRules.currency],
          placeholder: 'e.g., 150000'
        },
        {
          key: 'projectFunding',
          type: FieldTypes.CURRENCY,
          label: 'Total project/program-specific funding ($)',
          validation: [ValidationRules.required, ValidationRules.currency],
          placeholder: 'e.g., 75000'
        }
      ],
      calculations: [
        {
          key: 'totalFunding',
          formula: (data) => data.coreFunding + data.projectFunding,
          label: 'Total funding ($)',
          format: 'currency'
        },
        {
          key: 'corePercentage',
          formula: (data) => Calculations.corePercentage(data.coreFunding, data.totalFunding),
          label: 'Core funding percentage (%)',
          format: 'percentage'
        },
        {
          key: 'fundingRatio',
          formula: (data) => Calculations.fundingRatio(data.projectFunding, data.coreFunding),
          label: 'Funding leverage ratio',
          format: 'ratio'
        }
      ]
    };
  }
  
  // Yes/No questions
  if (method.includes('yes/no') || method.includes('(yes / no)')) {
    return {
      type: FieldTypes.RADIO,
      options: StandardOptions.yesNoNA,
      validation: [ValidationRules.required]
    };
  }
  
  // Checkbox questions
  if (method.includes('check all that apply') || method.includes('☐')) {
    // Extract options from measurement method
    const options = extractCheckboxOptions(measurementMethod);
    return {
      type: FieldTypes.CHECKBOX,
      options: options.length > 0 ? options : StandardOptions.collaborationTypes,
      validation: [ValidationRules.required]
    };
  }
  
  // Difficulty scales
  if (method.includes('difficult') && method.includes('options:')) {
    return {
      type: FieldTypes.RADIO,
      options: StandardOptions.difficulty,
      validation: [ValidationRules.required]
    };
  }
  
  // Satisfaction scales
  if (name.includes('satisfaction') || method.includes('satisfied')) {
    return {
      type: FieldTypes.SCALE,
      scale: StandardOptions.satisfactionScale,
      validation: [ValidationRules.required]
    };
  }
  
  // Board compensation
  if (name.includes('board') && name.includes('compensation')) {
    return {
      type: FieldTypes.CHECKBOX,
      options: StandardOptions.boardCompensation,
      validation: [ValidationRules.required]
    };
  }
  
  // Collaboration questions
  if (name.includes('collaboration') || name.includes('coalition')) {
    if (method.includes('how many')) {
      return {
        type: FieldTypes.NUMBER,
        label: 'Number of meetings/events attended',
        validation: [ValidationRules.required, ValidationRules.staffCount],
        placeholder: 'e.g., 4'
      };
    }
    return {
      type: FieldTypes.CHECKBOX,
      options: StandardOptions.collaborationTypes,
      validation: [ValidationRules.required]
    };
  }
  
  // Generic number input
  if (method.includes('how many') || method.includes('number of')) {
    return {
      type: FieldTypes.NUMBER,
      validation: [ValidationRules.required, ValidationRules.staffCount],
      placeholder: 'Enter number'
    };
  }
  
  // Generic percentage
  if (method.includes('percentage') || method.includes('%')) {
    return {
      type: FieldTypes.PERCENTAGE,
      validation: [ValidationRules.required, ValidationRules.percentage],
      placeholder: 'e.g., 25'
    };
  }
  
  // Fallback to short text (discouraged)
  return {
    type: FieldTypes.TEXT_SHORT,
    maxLength: 100,
    validation: [ValidationRules.required],
    placeholder: 'Brief response (max 100 characters)',
    warning: 'Consider converting this to structured data for better comparability'
  };
};

/**
 * Extract checkbox options from measurement method text
 */
const extractCheckboxOptions = (measurementMethod) => {
  if (!measurementMethod) return [];
  
  const options = [];
  const lines = measurementMethod.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('☐')) {
      const optionText = trimmedLine.substring(2).trim();
      if (optionText && optionText !== 'Other (please specify)') {
        options.push({
          value: optionText.toLowerCase().replace(/\s+/g, '_'),
          label: optionText
        });
      }
    }
  }
  
  // Always add "Other" option for flexibility
  if (options.length > 0) {
    options.push({ value: 'other', label: 'Other (specify)' });
  }
  
  return options;
};

/**
 * Data Quality Scoring
 * Scores the completeness and standardization level of responses
 */
export const calculateDataQuality = (responses) => {
  let totalFields = 0;
  let completedFields = 0;
  let standardizedFields = 0;
  
  Object.entries(responses).forEach(([key, response]) => {
    totalFields++;
    
    if (response.value != null && response.value !== '') {
      completedFields++;
      
      // Higher score for structured data types
      if ([
        FieldTypes.NUMBER, 
        FieldTypes.CURRENCY, 
        FieldTypes.RADIO, 
        FieldTypes.CHECKBOX,
        FieldTypes.SCALE,
        FieldTypes.CALCULATED
      ].includes(response.type)) {
        standardizedFields++;
      }
    }
  });
  
  return {
    completeness: totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0,
    standardization: completedFields > 0 ? Math.round((standardizedFields / completedFields) * 100) : 0,
    overallScore: totalFields > 0 ? Math.round(((completedFields * 0.6 + standardizedFields * 0.4) / totalFields) * 100) : 0
  };
};

/**
 * Organization Detection Engine
 * Automatically detects organization from CSV data patterns
 */
export const detectOrganization = (csvData) => {
  if (!csvData || csvData.length === 0) return null;
  
  // Extract potential organization codes from CSV headers or data
  const firstRow = csvData[0];
  const allText = JSON.stringify(csvData).toLowerCase();
  
  // Known organization patterns
  const organizations = {
    'VFWC': { name: 'Victoria Family Works Centre', code: 'VFWC' },
    'WAWC': { name: 'Women\'s Action Women\'s Centre', code: 'WAWC' },
    'VCWS': { name: 'Victoria Community Women\'s Shelter', code: 'VCWS' },
    'CWWA': { name: 'Community Women\'s Worker Association', code: 'CWWA' },
    'YWCA': { name: 'YWCA Victoria', code: 'YWCA' }
  };
  
  // Search for organization codes in the data
  for (const [code, org] of Object.entries(organizations)) {
    if (allText.includes(code.toLowerCase())) {
      return org;
    }
  }
  
  // Fallback: try to extract from filename or headers
  if (firstRow && typeof firstRow === 'object') {
    for (const key of Object.keys(firstRow)) {
      const keyUpper = key.toUpperCase();
      if (organizations[keyUpper]) {
        return organizations[keyUpper];
      }
    }
  }
  
  return { name: 'Organization', code: 'ORG' };
};

/**
 * Generate Standardized Fields from CSV Data
 * Transforms CSV indicator data into standardized form fields
 */
export const generateStandardizedFields = (csvData) => {
  if (!csvData || csvData.length === 0) return [];
  
  const indicators = [];
  
  // Parse CSV data to extract indicators
  csvData.forEach((row, index) => {
    if (!row.Indicator || !row['Measurement Method']) return;
    
    const indicator = {
      id: `indicator_${index}`,
      title: row.Indicator.trim(),
      description: row.Notes || '',
      tier: determineTier(row.Indicator, row['Measurement Method']),
      fields: []
    };
    
    // Create standardized fields based on measurement method
    const fieldConfig = createFieldConfig(row.Indicator, row['Measurement Method']);
    
    if (fieldConfig.type === 'calculated_group') {
      // Complex calculated indicators
      fieldConfig.fields.forEach(field => {
        indicator.fields.push({
          id: `${indicator.id}_${field.key}`,
          type: field.type,
          label: field.label,
          description: field.description,
          required: true,
          placeholder: field.placeholder,
          validation: field.validation
        });
      });
      
      // Add calculated fields
      fieldConfig.calculations?.forEach(calc => {
        indicator.fields.push({
          id: `${indicator.id}_${calc.key}`,
          type: FieldTypes.CALCULATED,
          label: calc.label,
          formula: calc.formula,
          format: calc.format,
          unit: calc.format === 'percentage' ? '%' : (calc.format === 'currency' ? '$' : ''),
          required: false
        });
      });
    } else {
      // Simple field
      indicator.fields.push({
        id: `${indicator.id}_main`,
        type: fieldConfig.type,
        label: row.Indicator,
        description: row['Measurement Method'],
        options: fieldConfig.options || fieldConfig.scale,
        required: true,
        placeholder: fieldConfig.placeholder,
        validation: fieldConfig.validation,
        maxLength: fieldConfig.maxLength,
        warning: fieldConfig.warning
      });
    }
    
    indicators.push(indicator);
  });
  
  return indicators;
};

/**
 * Determine indicator tier based on content analysis
 */
const determineTier = (indicator, method) => {
  const text = `${indicator} ${method}`.toLowerCase();
  
  // Tier 1 (foundational): Basic operational metrics
  if (text.includes('staff') && text.includes('turnover')) return 1;
  if (text.includes('funding') && (text.includes('core') || text.includes('ratio'))) return 1;
  if (text.includes('board') && text.includes('meeting')) return 1;
  
  // Tier 2 (developmental): Growth and improvement metrics
  if (text.includes('collaboration') || text.includes('coalition')) return 2;
  if (text.includes('satisfaction') || text.includes('feedback')) return 2;
  if (text.includes('training') || text.includes('professional development')) return 2;
  
  // Tier 3 (advanced): Strategic and outcome metrics
  if (text.includes('outcome') || text.includes('impact')) return 3;
  if (text.includes('policy') || text.includes('advocacy')) return 3;
  if (text.includes('leadership') || text.includes('governance')) return 3;
  
  return 2; // Default to tier 2
};

/**
 * Calculate completion score for progress tracking
 */
export const calculateCompletionScore = (indicators, responses) => {
  if (!indicators || indicators.length === 0) {
    return { percentage: 0, completed: 0, total: 0 };
  }
  
  let totalFields = 0;
  let completedFields = 0;
  
  indicators.forEach(indicator => {
    indicator.fields.forEach(field => {
      if (field.type !== FieldTypes.CALCULATED) {
        totalFields++;
        if (responses[field.id] != null && responses[field.id] !== '') {
          completedFields++;
        }
      }
    });
  });
  
  const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  
  return {
    percentage,
    completed: completedFields,
    total: totalFields
  };
};