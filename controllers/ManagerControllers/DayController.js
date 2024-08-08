const fs = require('fs');
const dataFilePath = './days.json';

const readDataFromFile = () => {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    return {};
};

const writeDataToFile = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

module.exports = {

    addDays: async (req, res) => {
        const { days } = req.body;
        if (!Array.isArray(days)) {
            return res.status(400).json({ data: 'Days must be an array' });
        }
    
        const data = readDataFromFile();
        data.days = days;
        writeDataToFile(data);
    
        res.status(200).json({ message: 'Days added successfully', data: data });
    },

    getAllDays: async (req, res) => {
        const data = readDataFromFile();
        if (!data.days) {
            return res.status(404).json({ data: 'No days found' });
        }
    
        res.status(200).json({ data: data.days });
    },

}