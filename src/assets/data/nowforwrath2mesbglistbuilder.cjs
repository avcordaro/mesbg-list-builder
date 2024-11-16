const fs = require('fs');

function loadAndCleanNowForWrathData() {
    const data = fs.readFileSync('nowforwrath.data2024.json', 'utf8');
    const parsed = JSON.parse(data);

    return [...parsed.data.heroes, ...parsed.data.warriors]
        .map(unit => ({
            name: unit.name,
            mv: `${unit.movement}`,
            fs: `${unit.fight}/${unit.shoot}+`,
            s: `${unit.strength}`,
            d: `${unit.defence}`,
            a: `${unit.attack}`,
            w: `${unit.wounds}`,
            c: `${unit.courage}`,
        }))
        .reduce((map, current) => ({...map, [current.name]: current}), {});
}

function loadAndMapUnitNames() {
    const data = fs.readFileSync('mesbg_data.json', 'utf8');
    const parsed = JSON.parse(data);

    return parsed
        .reduce((map, current) => ({...map, [current.model_id]: current.name}), {});
}

function mapStatsToModelIds(models, stats) {
    const modelsWithStats = Object.entries(models).map(([model_id, name]) => [model_id, {name, ...stats[name]}]);
    const v = modelsWithStats
        .filter(([, stats]) => !!stats.mv && stats.mv !== 'undefined')
        .map(([model_id, stats]) => ({model_id, ...stats}));
    const nv = modelsWithStats
        .filter(([, stats]) => !stats.mv || stats.mv === 'undefined')
        .map(([model_id, stats]) => ({model_id, name: stats.name, mv: "", fs: "", s: "", d: "", a: "", w: "", c: ""}));

    console.log(`Models with stats: ${v.length}`)
    console.warn(`There are ${nv.length} models listed with no stats!`);

    return [...v, ...nv]
}

function writeJsonToFile(filePath, jsonObject) {
    const jsonString = JSON.stringify(jsonObject, null, 2); // Convert object to JSON string with 2-space indentation
    fs.writeFile(filePath, jsonString, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON to file:', err);
            process.exit(1);
        } else {
            console.log(`Written data to ${filePath}`);
        }
    });
}

try {
    const stats = loadAndCleanNowForWrathData();
    const models = loadAndMapUnitNames();

    const modelsWithStats = mapStatsToModelIds(models, stats);

    writeJsonToFile("stats.json", modelsWithStats)
} catch (err) {
    console.error('Error reading the file:', err);
}
