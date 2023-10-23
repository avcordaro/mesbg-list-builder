import pandas as pd
import json
import re

warband_sizes = {
  "Hero of Legend": 18,
  "Hero of Valour": 15,
  "Hero of Fortitude": 12,
  "Minor Hero": 6,
  "Independent Hero": 1,
  "Independent Hero*": 0,
  "Warrior": 1,
  "Siege Engine": 6
}
unit_type_order = [
  "Hero of Legend",
  "Hero of Valour",
  "Hero of Fortitude",
  "Minor Hero",
  "Independent Hero",
  "Independent Hero*",
  "Warrior",
  "Siege Engine"
]

df_models = pd.read_excel("mesbg_data.xlsx", sheet_name="models")
df_models['quantity'] = 1
df_models['pointsPerUnit'] = df_models['base_points']
df_models['pointsTotal'] = df_models['base_points']
df_models['warband_size'] = df_models['unit_type'].map(warband_sizes)
df_models.loc[df_models.name == "Sauron", 'warband_size'] = 24
df_models['inc_bow_count'] = df_models['default_bow']
df_models.unit_type = pd.Categorical(df_models.unit_type, categories=unit_type_order)

df_options = pd.read_excel("mesbg_data.xlsx", sheet_name="options")
df_options = df_options.sort_values(['faction', 'name', 'points'], ascending=[True, True, False])
df_options['opt_quantity'] = df_options['min']
df_merged = df_models.merge(df_options, on=['faction', 'name'], how='left')
df_merged['option_id'].fillna("None", inplace=True)
df_merged['option'].fillna("None", inplace=True)
df_merged['points'].fillna("None", inplace=True)
df_merged['min'].fillna(0, inplace=True)
df_merged['max'].fillna(1, inplace=True)
df_merged['opt_quantity'].fillna(0, inplace=True)
df_merged_options = df_merged.groupby([
  'model_id', 
  'faction_type', 
  'faction', 
  'profile_origin', 
  'name', 'unit_type', 
  'base_points', 
  'default_bow', 
  'unique', 
  'inc_bow_count', 
  'siege_crew', 
  'quantity', 
  'pointsPerUnit', 
  'pointsTotal', 
  'warband_size'
]).apply(lambda x: x[[
  'option_id', 
  'option', 
  'points', 
  'type', 
  'min', 
  'max', 
  'opt_quantity'
]].to_dict(orient='records')).reset_index(name='options')
df_merged_options =df_merged_options.sort_values(['faction', 'unit_type', 'base_points', 'name'], ascending=[True, True, False, True])
json_dict = df_merged_options.to_json(orient='records', indent=2)

with open('mesbg_data.json', 'w') as f:
    f.write(json_dict)

df_faction = pd.read_excel("mesbg_data.xlsx", sheet_name="factions")
df_faction.index = df_faction.name
df_faction = df_faction[['armyBonus', 'primaryAllies', 'secondaryAllies']]
df_faction['armyBonus'] = df_faction['armyBonus'].apply(lambda x: re.sub('\n', '<br/>', x))
df_faction['primaryAllies'] = df_faction['primaryAllies'].fillna("[]")
df_faction['secondaryAllies'] = df_faction['secondaryAllies'].fillna("[]")
df_faction['primaryAllies'] = df_faction['primaryAllies'].apply(eval)
df_faction['secondaryAllies'] = df_faction['secondaryAllies'].apply(eval)

with open('faction_data.json', 'w') as f:
    f.write(df_faction.to_json(orient="index", indent=2))

df_hero_constraints = pd.read_excel("mesbg_data.xlsx", sheet_name="hero_constraints")
df_hero_constraints['valid_warband_units'] = df_hero_constraints['valid_warband_units'].apply(eval)
df_hero_constraints['special_unit_options'] = df_hero_constraints['special_unit_options'].apply(eval)
df_hero_constraints = df_hero_constraints.groupby('hero_model_id').apply(lambda x: x[['valid_warband_units', 'special_unit_options']].to_dict(orient='records'))

with open('hero_constraint_data.json', 'w') as f:
    f.write(df_hero_constraints.to_json(orient="index", indent=2))