#!/usr/bin/env python3
"""Rebuild in memory; exclude only the build timestamp, never source evidence times."""
import importlib.util,json,pathlib
root=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('policy_build',root/'scripts/build-policy-dataset.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
expected=m.build();actual=json.loads((root/'data/processed/policy-intelligence.json').read_text())
expected.pop('builtAt');actual.pop('builtAt');assert expected==actual,'Captured-data reproduction differs'
print('Offline source hashes, fields, counts, audit history and policy registry reproduce exactly; only build timestamp excluded')
