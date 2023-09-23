import pandas as pd
import json

warband_sizes = {
  "Hero of Legend": 18,
  "Hero of Valour": 15,
  "Hero of Fortitude": 12,
  "Minor Hero": 6,
  "Independent Hero": 1,
  "Warrior": 1,
  "Siege Engine": 6
}
unit_type_order = [
  "Hero of Legend",
  "Hero of Valour",
  "Hero of Fortitude",
  "Minor Hero",
  "Independent Hero",
  "Warrior",
  "Siege Engine"
]

df_models = pd.read_excel("mesbg_models.xlsx")
df_models['quantity'] = 1
df_models['pointsPerUnit'] = df_models['base_points']
df_models['pointsTotal'] = df_models['base_points']
df_models['warband_size'] = df_models['unit_type'].map(warband_sizes)
df_models['inc_bow_count'] = df_models['default_bow']
df_models.unit_type = pd.Categorical(df_models.unit_type, categories=unit_type_order)
df_options = pd.read_excel("mesbg_options.xlsx")
df_options['opt_quantity'] = df_options['min']
df_merged = df_models.merge(df_options, on=['faction', 'name'], how='left')
df_merged['option_id'].fillna("None", inplace=True)
df_merged['option'].fillna("None", inplace=True)
df_merged['points'].fillna("None", inplace=True)
df_merged['is_bow'].fillna(False, inplace=True)
df_merged['min'].fillna(0, inplace=True)
df_merged['max'].fillna(1, inplace=True)
df_merged['opt_quantity'].fillna(0, inplace=True)
df_merged_options = df_merged.groupby(['faction', 'name', 'unit_type', 'base_points', 'default_bow', 'inc_bow_count', 'siege_crew', 'quantity', 'pointsPerUnit', 'pointsTotal', 'warband_size'])\
  .apply(lambda x: x[['option_id', 'option', 'points', 'is_bow', 'min', 'max', 'opt_quantity']].to_dict(orient='records')).reset_index(name='options')
df_merged_options =df_merged_options.sort_values(['faction', 'unit_type', 'name'])
json_dict = df_merged_options.to_dict(orient='records')

with open('mesbg_data.json', 'w') as f:
    json.dump(json_dict, f)