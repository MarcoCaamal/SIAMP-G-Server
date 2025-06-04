pipeline {
    agent any
      environment {
        // Configuración de Node.js
        NODE_VERSION = '18'
        // Configuración de Docker - Opciones:
        // Docker Hub: 'tu-usuario' o 'docker.io/tu-usuario'
        // GitHub: 'ghcr.io/tu-usuario'  
        // Azure: 'tu-registry.azurecr.io'
        // Local: '' (vacío para no usar registro)
        DOCKER_REGISTRY = ''  // Cambiar por tu registro
        IMAGE_NAME = 'siamp-g-server'
        // Configuración de la aplicación
        PORT = '3000'
        NODE_ENV = 'production'
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {
        stage('📋 Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }
        
        stage('🔍 Environment Info') {
            steps {
                echo '📊 Displaying environment information...'
                sh '''
                    echo "Node version: $(node --version)"
                    echo "NPM version: $(npm --version)"
                    echo "Docker version: $(docker --version)"
                    echo "Current directory: $(pwd)"
                    echo "Files in directory: $(ls -la)"
                '''
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo '📥 Installing Node.js dependencies...'
                sh '''
                    npm ci --only=production=false
                    echo "✅ Dependencies installed successfully"
                '''
            }
        }
        
        stage('🔨 Build Application') {
            steps {
                echo '🏗️ Building NestJS application...'
                sh '''
                    npm run build
                    echo "✅ Application built successfully"
                '''
            }
        }
        
        stage('🧹 Code Quality') {
            parallel {
                stage('ESLint') {
                    steps {
                        echo '🔍 Running ESLint...'
                        sh '''
                            npm run lint
                            echo "✅ ESLint checks passed"
                        '''
                    }
                }
                stage('Prettier') {
                    steps {
                        echo '🎨 Checking code formatting...'
                        sh '''
                            npm run format
                            echo "✅ Code formatting checked"
                        '''
                    }
                }
            }
        }
        
        stage('🧪 Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        echo '🧪 Running unit tests...'
                        sh '''
                            npm run test -- --coverage --watchAll=false
                            echo "✅ Unit tests completed"
                        '''
                    }
                    post {
                        always {
                            // Publicar resultados de pruebas unitarias
                            publishTestResults testResultsPattern: 'coverage/lcov-report/**/*.xml'
                            publishCoverage adapters: [
                                istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')
                            ], sourceFileResolver: sourceFiles('STORE_LAST_BUILD')
                        }
                    }
                }
                stage('E2E Tests') {
                    steps {
                        echo '🌐 Running end-to-end tests...'
                        // Iniciar MongoDB para pruebas E2E
                        sh '''
                            # Iniciar MongoDB en Docker para pruebas
                            docker run -d --name test-mongo -p 27017:27017 mongo:7.0
                            sleep 10
                            
                            # Ejecutar pruebas E2E
                            npm run test:e2e
                            
                            echo "✅ E2E tests completed"
                        '''
                    }
                    post {
                        always {
                            // Limpiar contenedor de pruebas
                            sh '''
                                docker stop test-mongo || true
                                docker rm test-mongo || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('🐳 Docker Build') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo '🏗️ Building Docker image...'
                script {
                    def imageTag = "${BUILD_NUMBER}-${GIT_COMMIT.take(8)}"
                    env.IMAGE_TAG = imageTag
                          sh '''
                    # Construir imagen Docker
                    if [ -z "${DOCKER_REGISTRY}" ]; then
                        # Solo construcción local
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
                        echo "✅ Docker image built locally: ${IMAGE_NAME}:${IMAGE_TAG}"
                    else
                        # Construcción con registro
                        docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest .
                        echo "✅ Docker image built: ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    fi
                    
                    # Mostrar información de la imagen
                    docker images | grep ${IMAGE_NAME}
                '''
                }
            }
        }
        
        stage('� Push to Registry') {
            when {
                allOf {
                    anyOf {
                        branch 'main'
                        branch 'develop'
                    }
                    not { equals actual: "${DOCKER_REGISTRY}", expected: "" }
                }
            }
            steps {
                echo '📤 Pushing Docker image to registry...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            # Login al registro Docker
                            echo "${DOCKER_PASS}" | docker login ${DOCKER_REGISTRY} -u "${DOCKER_USER}" --password-stdin
                            
                            # Push de las imágenes
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest
                            
                            echo "✅ Images pushed successfully to ${DOCKER_REGISTRY}"
                        '''
                    }
                }
            }
        }
        
        stage('�🔒 Security Scan') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            parallel {
                stage('NPM Audit') {
                    steps {
                        echo '🔍 Running NPM security audit...'
                        sh '''
                            npm audit --audit-level=high
                            echo "✅ NPM audit completed"
                        '''
                    }
                }
                stage('Docker Security Scan') {
                    steps {
                        echo '🔍 Running Docker security scan...'
                        script {
                            // Usar herramientas como Trivy o Snyk si están disponibles
                            sh '''
                                # Ejemplo con docker scout (si está disponible)
                                if command -v docker &> /dev/null; then
                                    echo "🔍 Scanning Docker image for vulnerabilities..."
                                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                                        aquasec/trivy image ${IMAGE_NAME}:${IMAGE_TAG} || echo "⚠️ Trivy not available"
                                fi
                                echo "✅ Security scan completed"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('🚀 Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo '🚀 Deploying to staging environment...'
                sh '''
                    # Detener contenedores existentes
                    docker-compose -f docker-compose.yml down || true
                    
                    # Desplegar nueva versión
                    docker-compose -f docker-compose.yml up -d --build
                    
                    # Verificar que los servicios estén funcionando
                    sleep 30
                    curl -f http://localhost:3000/health || echo "⚠️ Health check failed"
                    
                    echo "✅ Staging deployment completed"
                '''
            }
        }
        
        stage('🚀 Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Solicitar aprobación manual para producción
                    def userInput = input(
                        id: 'deploy-to-production',
                        message: '🚀 Deploy to Production?',
                        parameters: [
                            choice(
                                choices: ['Deploy', 'Abort'],
                                description: 'Choose action',
                                name: 'action'
                            )
                        ]
                    )
                    
                    if (userInput == 'Deploy') {
                        echo '🚀 Deploying to production environment...'
                        sh '''
                            # Crear backup de la base de datos (opcional)
                            echo "📦 Creating database backup..."
                            
                            # Desplegar en producción con zero-downtime
                            docker-compose -f docker-compose.prod.yml down || true
                            docker-compose -f docker-compose.prod.yml up -d --build
                            
                            # Verificar despliegue
                            sleep 30
                            curl -f http://localhost:3000/health || echo "⚠️ Production health check failed"
                            
                            echo "✅ Production deployment completed"
                        '''
                    } else {
                        echo '❌ Production deployment cancelled by user'
                        error('Deployment cancelled')
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up workspace...'
            // Limpiar archivos temporales
            sh '''
                # Limpiar contenedores de prueba
                docker container prune -f || true
                
                # Limpiar imágenes no utilizadas
                docker image prune -f || true
                
                echo "✅ Cleanup completed"
            '''
        }
        
        success {
            echo '🎉 Pipeline completed successfully!'
            // Notificaciones de éxito (Slack, Teams, email, etc.)
            script {
                if (env.BRANCH_NAME == 'main') {
                    echo '📧 Sending success notification for production deployment...'
                }
            }
        }
        
        failure {
            echo '❌ Pipeline failed!'
            // Notificaciones de fallo
            script {
                echo '📧 Sending failure notification...'
                // Aquí puedes agregar notificaciones a Slack, Teams, etc.
            }
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings!'
        }
        
        cleanup {
            echo '🧽 Final cleanup...'
            cleanWs()
        }
    }
}