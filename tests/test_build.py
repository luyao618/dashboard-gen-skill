import csv
import importlib.util
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('build', ROOT / 'scripts/build_demos.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)


class BuildTests(unittest.TestCase):
    def test_embedded_data_round_trips_all_source_records(self):
        for kind, config in build.CONFIGS.items():
            with self.subTest(kind=kind):
                output = build.build(kind)
                payload = json.loads(re.search(r'<script id="dashboard-data" type="application/json">(.*?)</script>', output, re.S).group(1))
                with (ROOT / 'assets/sample_data' / config['file']).open(newline='', encoding='utf-8-sig') as stream:
                    reader = csv.DictReader(stream)
                    source = list(reader)
                self.assertEqual(len(source), len(payload['rows']))
                for original, embedded in zip(source, payload['rows']):
                    actual = dict(zip(payload['columns'], embedded))
                    for key, value in original.items():
                        expected = float(value) if key in config['numeric'] and value else value or None
                        if key not in config['numeric']:
                            expected = value
                        self.assertEqual(expected, actual[key])
                self.assertEqual((ROOT / 'assets' / f'demo_{kind}.html').read_text(), output)

    def test_script_end_tags_cannot_escape_json(self):
        data = {'name': '</script><img src=x onerror=alert(1)> & 中文\u2028\u2029', 'value': None}
        payload = build.safe_json(data)
        self.assertNotIn('<', payload)
        self.assertNotIn('&', payload)
        self.assertEqual(json.loads(payload), data)
        with self.assertRaises(ValueError):
            build.safe_json({'value': float('nan')})


if __name__ == '__main__':
    unittest.main()
