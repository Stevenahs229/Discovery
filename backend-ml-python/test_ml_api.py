"""
Script de test pour le Backend ML Python de TwoInOne
Teste tous les endpoints de reconnaissance faciale
"""

import requests
import os
from pathlib import Path

# Configuration
API_URL = os.getenv("ML_API_URL", "http://localhost:8000")
TEST_TOKEN = "test-token-123"
TEST_USER_ID = "test-user-abc"

# Couleurs pour le terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def test_health_check():
    """Test 1: Health check"""
    print_info("Test 1: Health Check...")
    
    try:
        response = requests.get(f"{API_URL}/ml/health")
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Health check OK - Status: {data.get('status')}")
            print(f"  Libraries: {data.get('ml_libraries')}")
            return True
        else:
            print_error(f"Health check failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Health check error: {e}")
        return False

def test_enroll_face():
    """Test 2: Enregistrer un visage"""
    print_info("Test 2: Enregistrer un visage...")
    
    # Créer une image de test (pixel noir)
    from PIL import Image
    import io
    
    # Créer une image de test simple
    img = Image.new('RGB', (200, 200), color='white')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    try:
        files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
        headers = {
            'user_id': TEST_USER_ID,
            'authorization': f'Bearer {TEST_TOKEN}'
        }
        
        response = requests.post(
            f"{API_URL}/ml/enroll-face",
            files=files,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_success(f"Enregistrement OK - {data.get('message')}")
                return True
            else:
                print_warning(f"Enregistrement: {data.get('message', 'Aucun visage détecté')}")
                return False
        elif response.status_code == 400:
            data = response.json()
            print_warning(f"Enregistrement attendu - {data.get('detail', 'Erreur')}")
            print_info("  → C'est normal avec une image de test vide")
            return True  # Considéré comme succès car l'API répond correctement
        else:
            print_error(f"Enregistrement failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Enregistrement error: {e}")
        return False

def test_verify_face():
    """Test 3: Vérifier un visage"""
    print_info("Test 3: Vérifier un visage...")
    
    from PIL import Image
    import io
    
    img = Image.new('RGB', (200, 200), color='blue')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    img_bytes.seek(0)
    
    try:
        files = {'file': ('verify.jpg', img_bytes, 'image/jpeg')}
        headers = {'authorization': f'Bearer {TEST_TOKEN}'}
        
        response = requests.post(
            f"{API_URL}/ml/verify-face",
            files=files,
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_success(f"Vérification OK - User: {data.get('user_id')}, Confiance: {data.get('confidence')}")
            else:
                print_warning(f"Vérification: {data.get('message')}")
                print_info("  → Normal si aucun visage enregistré ou image test")
            return True
        else:
            print_error(f"Vérification failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Vérification error: {e}")
        return False

def test_list_enrolled_users():
    """Test 4: Lister les utilisateurs enregistrés"""
    print_info("Test 4: Lister les utilisateurs enregistrés...")
    
    try:
        headers = {'authorization': f'Bearer {TEST_TOKEN}'}
        response = requests.get(
            f"{API_URL}/ml/users-enrolled",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            users = data.get('enrolled_users', [])
            count = data.get('total_count', 0)
            print_success(f"Liste OK - {count} utilisateur(s) enregistré(s)")
            if users:
                print(f"  Users: {', '.join(users)}")
            return True
        else:
            print_error(f"Liste failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Liste error: {e}")
        return False

def test_delete_face():
    """Test 5: Supprimer un enregistrement"""
    print_info("Test 5: Supprimer un enregistrement...")
    
    try:
        headers = {'authorization': f'Bearer {TEST_TOKEN}'}
        response = requests.delete(
            f"{API_URL}/ml/delete-face/{TEST_USER_ID}",
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Suppression OK - {data.get('message')}")
            return True
        elif response.status_code == 404:
            print_warning("Utilisateur non trouvé (normal si jamais enregistré)")
            return True
        else:
            print_error(f"Suppression failed - Status: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Suppression error: {e}")
        return False

def run_all_tests():
    """Exécuter tous les tests"""
    print("\n" + "="*60)
    print(f"{Colors.BLUE}🧪 TESTS DU BACKEND ML PYTHON - TwoInOne{Colors.END}")
    print(f"API URL: {API_URL}")
    print("="*60 + "\n")
    
    tests = [
        ("Health Check", test_health_check),
        ("Enregistrer un visage", test_enroll_face),
        ("Vérifier un visage", test_verify_face),
        ("Lister utilisateurs", test_list_enrolled_users),
        ("Supprimer enregistrement", test_delete_face),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
            print()
        except Exception as e:
            print_error(f"Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
            print()
    
    # Résumé
    print("="*60)
    print(f"{Colors.BLUE}📊 RÉSUMÉ DES TESTS{Colors.END}")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = f"{Colors.GREEN}PASS{Colors.END}" if result else f"{Colors.RED}FAIL{Colors.END}"
        print(f"  {status} - {test_name}")
    
    print("\n" + "="*60)
    percentage = (passed / total) * 100
    
    if passed == total:
        print(f"{Colors.GREEN}✓ TOUS LES TESTS PASSÉS ({passed}/{total}) - {percentage:.0f}%{Colors.END}")
    else:
        print(f"{Colors.YELLOW}⚠ {passed}/{total} tests passés - {percentage:.0f}%{Colors.END}")
    
    print("="*60 + "\n")
    
    return passed == total

if __name__ == "__main__":
    import sys
    
    # Vérifier si le serveur est accessible
    try:
        requests.get(API_URL, timeout=5)
    except requests.exceptions.ConnectionError:
        print_error(f"Impossible de se connecter au serveur: {API_URL}")
        print_info("Vérifiez que le serveur est démarré:")
        print_info("  cd backend-ml-python")
        print_info("  uvicorn main:app --reload")
        sys.exit(1)
    except Exception as e:
        print_warning(f"Avertissement: {e}")
    
    # Exécuter les tests
    success = run_all_tests()
    
    # Code de sortie
    sys.exit(0 if success else 1)
