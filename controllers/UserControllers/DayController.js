const fs = require('fs');
const dataFilePath = './days.json';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const readDataFromFile = () => {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    return {};
};

module.exports = {

    getAllDays: async (req, res) => {
        const data = readDataFromFile();
        if (!data.days) {
            return res.status(404).json({ data: 'No days found' });
        }
    
        res.status(200).json({ data: data.days });
    },

    getAllPreventDays: async (req, res) => {
        const data = readDataFromFile();
        if (!data.days) {
            return res.status(404).json({ data: 'No days found' });
        } else {
            const forbiddenDays = [];
            for (let i = 0; i < daysOfWeek.length; i++) {
                if (!data.days.includes(daysOfWeek[i])) {
                    forbiddenDays.push(daysOfWeek[i]);
                }
            }
            res.status(200).json({ data: forbiddenDays });
        }
    
    },

}