// pipeline {
//     agent any

//     environment {
//         DOCKER_IMAGE = 'lms-node-app'
//         DOCKER_REGISTRY = 'docker.io'
//         STUDENTS_PERSONAL_DOCS = '/home/administrator/MERN_RESOURCES/STUDENTS/PERSONAL_DOCS/'
//         STUDENTS_CERTIFICATES = '/home/administrator/MERN_RESOURCES/STUDENTS/CERTIFICATES/'
//         STUDENTS_OTHERS = '/home/administrator/MERN_RESOURCES/STUDENTS/OTHERS/'
//         STAFFS_PERSONAL_DOCS = '/home/administrator/MERN_RESOURCES/STAFFS/PERSONAL_DOCS/'
//         STAFFS_CERTIFICATES = '/home/administrator/MERN_RESOURCES/STAFFS/CERTIFICATES/'
//         STAFFS_OTHERS = '/home/administrator/MERN_RESOURCES/STAFFS/OTHERS/'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 script {
//                     // Use Jenkins credential for PAT authentication
//                     withCredentials([string(credentialsId: 'GitPat', variable: 'GIT_PAT')]) {
//                         git url: "https://${GIT_PAT}@github.com/SurajSinghDevloper/lms_node.git", branch: 'master'
//                     }
//                 }
//             }
//         }

//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     // Build the Docker image for the Node.js app
//                     sh 'docker build -t ${DOCKER_IMAGE} .'
//                 }
//             }
//         }

//         stage('Run Docker Container') {
//             steps {
//                 script {
//                     // Stop and remove any existing container with the same name
//                     sh 'docker stop ${DOCKER_IMAGE} || true'
//                     sh 'docker rm ${DOCKER_IMAGE} || true'

//                     // Run the container with mounted volumes
//                     sh '''
//                     docker run -d --name ${DOCKER_IMAGE} \
//                       -p 5000:5000 \
//                       -v ${STUDENTS_PERSONAL_DOCS}:/app/resources/students/personal_docs \
//                       -v ${STUDENTS_CERTIFICATES}:/app/resources/students/certificates \
//                       -v ${STUDENTS_OTHERS}:/app/resources/students/others \
//                       -v ${STAFFS_PERSONAL_DOCS}:/app/resources/staffs/personal_docs \
//                       -v ${STAFFS_CERTIFICATES}:/app/resources/staffs/certificates \
//                       -v ${STAFFS_OTHERS}:/app/resources/staffs/others \
//                       ${DOCKER_IMAGE}
//                     '''
//                 }
//             }
//         }

//         stage('Push Docker Image to Registry') {
//             steps {
//                 script {
//                     // Optionally, push the Docker image to a registry (if using a private registry)
//                     sh 'docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/username/${DOCKER_IMAGE}:latest'
//                     sh 'docker push ${DOCKER_REGISTRY}/username/${DOCKER_IMAGE}:latest'
//                 }
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Deployment succeeded'
//         }
//         failure {
//             echo 'Deployment failed'
//         }
//     }
// }


pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'lms-node-app'
        DOCKER_REGISTRY = 'docker.io'
        STUDENTS_PERSONAL_DOCS = '/home/administrator/MERN_RESOURCES/STUDENTS/PERSONAL_DOCS/'
        STUDENTS_CERTIFICATES = '/home/administrator/MERN_RESOURCES/STUDENTS/CERTIFICATES/'
        STUDENTS_OTHERS = '/home/administrator/MERN_RESOURCES/STUDENTS/OTHERS/'
        STAFFS_PERSONAL_DOCS = '/home/administrator/MERN_RESOURCES/STAFFS/PERSONAL_DOCS/'
        STAFFS_CERTIFICATES = '/home/administrator/MERN_RESOURCES/STAFFS/CERTIFICATES/'
        STAFFS_OTHERS = '/home/administrator/MERN_RESOURCES/STAFFS/OTHERS/'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Use Jenkins credential for PAT authentication
                    withCredentials([string(credentialsId: 'GitPat', variable: 'GIT_PAT')]) {
                        git url: "https://${GIT_PAT}@github.com/SurajSinghDevloper/lms_node.git", branch: 'master'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Remove old Docker images
                    sh '''
                    old_images=$(docker images -q ${DOCKER_IMAGE})
                    if [ ! -z "$old_images" ]; then
                        echo "Removing old Docker images..."
                        docker rmi -f $old_images
                    fi
                    '''

                    // Build the new Docker image for the Node.js app
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Stop and remove any existing container with the same name
                    sh 'docker stop ${DOCKER_IMAGE} || true'
                    sh 'docker rm ${DOCKER_IMAGE} || true'

                    // Run the container with mounted volumes
                    sh '''
                    docker run -d --name ${DOCKER_IMAGE} \
                      -p 5000:5000 \
                      -v ${STUDENTS_PERSONAL_DOCS}:/app/resources/students/personal_docs \
                      -v ${STUDENTS_CERTIFICATES}:/app/resources/students/certificates \
                      -v ${STUDENTS_OTHERS}:/app/resources/students/others \
                      -v ${STAFFS_PERSONAL_DOCS}:/app/resources/staffs/personal_docs \
                      -v ${STAFFS_CERTIFICATES}:/app/resources/staffs/certificates \
                      -v ${STAFFS_OTHERS}:/app/resources/staffs/others \
                      ${DOCKER_IMAGE}
                    '''
                }
            }
        }

        stage('Push Docker Image to Registry') {
            steps {
                script {
                    // Optionally, push the Docker image to a registry (if using a private registry)
                    sh 'docker tag ${DOCKER_IMAGE} ${DOCKER_REGISTRY}/username/${DOCKER_IMAGE}:latest'
                    sh 'docker push ${DOCKER_REGISTRY}/username/${DOCKER_IMAGE}:latest'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment succeeded'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
