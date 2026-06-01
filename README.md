# Review Shield

A machine learning-powered Chrome extension to detect fake reviews on e-commerce platforms.

## Features

- **Real-time Detection**: Automatically analyze reviews as you browse
- **Multi-platform Support**: Works on Amazon, Flipkart, and Myntra
- **Visual Highlighting**: Color-coded indicators for review credibility
- **Confidence Scores**: See detailed risk assessments
- **Privacy First**: All analysis performed securely

## Project Structure

```
review-shield/
├── chrome-extension/    # Chrome extension frontend
├── backend/            # Flask API backend
├── training/           # ML model training pipeline
├── docs/               # Documentation
├── demo/               # Demo materials
└── README.md
```

## Installation

### Chrome Extension

1. Clone the repository
2. Open `chrome://extensions/` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `chrome-extension` folder

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python -m app.main
```

The API will be available at `http://localhost:5000`

## Model Training

```bash
cd training
python scripts/preprocess_dataset.py
python scripts/generate_embeddings.py
python scripts/train_xgboost.py
python scripts/evaluate_model.py
python scripts/export_model.py
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/info` - Model information
- `POST /api/predict` - Predict fake reviews

## Technologies Used

- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Flask, Python
- **ML**: XGBoost, scikit-learn, SHAP
- **Data**: pandas, numpy
- **NLP**: transformers, BERT embeddings

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Authors

Review Shield Development Team

## Acknowledgments

- OPSpam dataset creators
- Open source ML community
