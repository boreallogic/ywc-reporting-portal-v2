# YWC Reporting Portal v2

## Automated, Standardized Reporting for Nonprofit Organizations

The YWC Reporting Portal v2 transforms subjective reporting processes into quantitative, comparable data collection. This automation-first approach ensures consistency across organizations and time periods while minimizing manual input.

## 🌟 Key Features

### **Automation-First Design**
- **Smart Field Generation**: Automatically creates standardized form fields from CSV indicators
- **Organization Detection**: Intelligent recognition of organization profiles from CSV data
- **Calculated Fields**: Auto-computed metrics (turnover rates, funding ratios, etc.)
- **Progress Tracking**: Real-time completion scoring and validation

### **Standardized Data Collection**
- **Quantitative Focus**: Converts subjective questions to structured data types
- **Comparable Results**: Enables cross-organization and temporal comparisons
- **Validation Rules**: Built-in data quality checks and error prevention
- **Professional Reports**: Automated JSON export for further processing

### **User Experience**
- **Guided Interface**: Step-by-step indicator completion with clear navigation
- **Mobile-Responsive**: Works on desktop, tablet, and mobile devices
- **Offline-Capable**: All processing happens client-side for privacy and speed
- **Instant Feedback**: Real-time progress updates and completion scoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern web browser

### Installation
```bash
# Clone or download the project
cd "YWC Reporting Portal v2"

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to begin using the portal.

### Usage
1. **Upload CSV**: Import your workplan indicators from the YWC Workplan Builder
2. **Complete Forms**: Fill out automatically-generated standardized forms
3. **Track Progress**: Monitor completion percentage and data quality
4. **Generate Report**: Export structured data for analysis and reporting

## 📊 Standardized Field Types

The portal automatically converts indicators into these structured data types:

### Quantitative Fields
- **Number**: Staff counts, client numbers, event attendance
- **Currency**: Funding amounts, budget figures
- **Percentage**: Calculated rates and ratios
- **Scale**: 1-5 satisfaction ratings, difficulty assessments

### Standardized Options
- **Radio**: Single choice from predefined options (Yes/No/N/A)
- **Checkbox**: Multiple selections from standard lists
- **Dropdown**: Single choice from comprehensive lists

### Calculated Fields
- **Auto-Computed**: Staff turnover rates, funding ratios
- **Real-Time**: Updates as you enter related data
- **Validated**: Automatic error checking and range validation

## 🏗 Technical Architecture

### Frontend Stack
- **React 18**: Modern component architecture
- **Vite**: Fast development and building
- **TailwindCSS**: Utility-first styling system
- **Papa Parse**: Client-side CSV processing

### Data Processing
- **Client-Side**: All processing happens in browser for privacy
- **Real-Time**: Immediate validation and calculation
- **Offline-First**: No server dependencies for core functionality

### File Structure
```
src/
├── App.jsx                 # Main application component
├── index.css              # TailwindCSS styles and component classes
├── utils/
│   └── dataEngine.js      # Standardized data collection engine
└── main.jsx               # Application entry point

public/
├── sample-indicators.csv   # Example CSV for testing
└── vite.svg               # Application favicon

config/
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite build configuration
└── package.json           # Dependencies and scripts
```

## 📈 Data Quality Features

### Completion Scoring
- **Real-Time**: Updates as forms are completed
- **Weighted**: Prioritizes structured over text responses
- **Visual**: Progress bar and percentage display

### Validation Engine
- **Type Checking**: Ensures data matches expected formats
- **Range Validation**: Percentages stay 0-100, positive numbers
- **Required Fields**: Prevents incomplete submissions
- **Smart Defaults**: Pre-fills known organization data

### Standardization Benefits
- **Cross-Organization Comparisons**: Apples-to-apples data analysis
- **Temporal Tracking**: Consistent metrics over time
- **Reduced Errors**: Structured inputs prevent common mistakes
- **Professional Output**: Clean data for reports and analysis

## 🔧 Customization

### Adding New Organization Profiles
Edit `src/utils/dataEngine.js` in the `detectOrganization` function:

```javascript
const organizations = {
  'YOUR_CODE': { 
    name: 'Your Organization Name', 
    code: 'YOUR_CODE' 
  },
  // ... existing organizations
};
```

### Extending Field Types
Add new field types in `src/utils/dataEngine.js`:

```javascript
export const FieldTypes = {
  // ... existing types
  NEW_TYPE: 'new_type'
};
```

### Custom Validation Rules
Add validation functions in `ValidationRules`:

```javascript
export const ValidationRules = {
  // ... existing rules
  customRule: (value) => {
    if (/* your condition */) return "Error message";
    return null;
  }
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify (Recommended)
1. Build the project: `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `dist/` folder to the page
4. Your site is live instantly!

### Deploy to Other Platforms
The `dist/` folder contains all static files needed for deployment to any web hosting service.

## 🔒 Privacy & Security

- **Client-Side Processing**: No data sent to external servers
- **Local Storage**: Data stays in user's browser
- **No Authentication**: No user accounts or login required
- **HTTPS**: Secure connections when deployed

## 🤝 Contributing

This project follows automation-first principles:

1. **Structured Data First**: Prefer quantitative over qualitative inputs
2. **Validation Heavy**: Include comprehensive error checking
3. **User Experience**: Minimize clicks and manual input
4. **Documentation**: Comment complex logic thoroughly

## 📞 Support

For questions about using the YWC Reporting Portal:

1. Check the built-in help text in form fields
2. Review the sample CSV file for format examples
3. Refer to this README for technical details

## 📄 License

This project is designed specifically for YWC member organizations. 

---

**Built with ❤️ for YWC Member Organizations**

*Transforming reporting from tedious to automatic, one indicator at a time.*
