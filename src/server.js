const app = require('./app');
const { PORT } = process.env || 3000;

console.log('porttt ', PORT)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
