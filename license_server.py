import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

class LicenseHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/licenses.json':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            try:
                with open('public/licenses.json', 'r', encoding='utf-8') as f:
                    data = f.read()
                self.wfile.write(data.encode('utf-8'))
            except Exception as e:
                self.wfile.write(json.dumps({"companies": []}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/license/check':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                company = data.get('company', '')
                nagios_url = data.get('nagios_url', '')
                
                print(f"🔐 Validação de licença: {company} - {nagios_url}")
                
                # Carrega licenças
                try:
                    with open('public/licenses.json', 'r', encoding='utf-8') as f:
                        licenses = json.load(f)
                except:
                    licenses = {"companies": []}
                
                # Busca empresa
                normalized_company = company.upper().replace(' ', '').replace('-', '')
                company_data = None
                
                for c in licenses['companies']:
                    if (c.get('normalizedName', '').upper() == normalized_company and 
                        c.get('nagiosUrl', '') == nagios_url):
                        company_data = c
                        break
                
                if company_data and company_data.get('isActive', False):
                    from datetime import datetime
                    expires_date = datetime.strptime(company_data['expires'], '%Y-%m-%d')
                    is_valid = expires_date > datetime.now()
                    
                    if is_valid:
                        response = {
                            "has_license": True,
                            "company": company_data['name'],
                            "license_type": company_data.get('licenseType', 'Licença Mensal'),
                            "expires": company_data['expires'],
                            "message": f"Licença válida para {company_data['name']}",
                            "contact_info": company_data.get('contact', 'Patrick Braga - Desenvolvedor')
                        }
                    else:
                        response = {
                            "has_license": False,
                            "company": company_data['name'],
                            "message": f"Licença expirada para {company_data['name']}. Renove por favor.",
                            "contact_info": company_data.get('contact', 'Patrick Braga - Desenvolvedor')
                        }
                else:
                    response = {
                        "has_license": False,
                        "company": company,
                        "message": f"Empresa {company} não possui licença válida.",
                        "contact_info": "Entre em contato com Patrick Braga:\n📱 Instagram: @patricksck\n🐙 GitHub: ghostsck"
                    }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            except Exception as e:
                print(f"Erro: {e}")
                self.send_response(500)
                self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

def start_server():
    server = HTTPServer(('localhost', 3001), LicenseHandler)
    print("🚀 Servidor de licenças rodando em http://localhost:3001")
    print("🔐 API de licenças: http://localhost:3001/api/license/check")
    server.serve_forever()

if __name__ == '__main__':
    start_server()
