# BHF-Promethes

This github repo is for the demo the promethes application. 





# Installation

## Requirements

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)
- [helm](https://helm.sh/docs/intro/install/)
- [go](https://go.dev/doc/install) (nur für lokales testen)
- [nodejs](https://nodejs.org/en/download/package-manager) (nur für lokales)

## Application for testing prometheus

### Go Matrix API

Go to the application/go folder

```bash
# Build the go image
docker build -t go-matrix-api .

# Then load the image into minikube context
minikube image load go-matrix-api:latest

# Now we can deploy the application with the service.yaml and deployment.yaml
kubectl create namespace application 
kubectl apply -f deployment.yaml 
```

Endpoints
```bash
curl http://localhost:3030/multiply\?size\=10

curl http://localhost:3030/metrics

curl http://localhost:3030
```

### Node Matrix API

Go to the application/nodejs folder
```bash
docker build -t node-matrix-api .

minikube image load node-matrix-api:latest

# Create a new namespace when when not exists
kubectl create namespace application 
kubectl apply -f deployment.yaml 
``` 

Endpoints
```bash
curl http://localhost:3000/multiply\?size\=10

curl http://localhost:3000/metrics

curl http://localhost:3000
```

if you apply new change to the application then remove the deployment and th e image in the minikube, and load the new image again into the minikube cluster and apply the deployment file



## Prometheus

- [official repository](https://github.com/prometheus/prometheus?tab=readme-ov-file)
- [helm repository](https://github.com/prometheus-community/helm-charts)


```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

kubectl create namespace monitoring

helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

helm show values prometheus-community/kube-prometheus-stack > values.yaml
```

Port forwarding for prometheus
```bash
kubectl port-forward service/prometheus-kube-prometheus-prometheus -n monitoring 8082:9090  
```


Now we need apply this change
```bash
helm upgrade prometheus prometheus-community/kube-prometheus-stack -n monitoring -f ./values.yaml

# if you have upgraded the chart then restart the following pod for applying the new config in the application `prometheus-prometheus-kube-prometheus-prometheus-0` or the deployment
# With this command you can restart the deployment
kubectl rollout restart deployment prometheus-kube-prometheus-operator -n monitoring

# Check the change
kubectl get svc -n monitoring

# Get minikube ip
minikube ip
# Get port
kubectl get svc prometheus-server -n monitoring -o=jsonpath='{.spec.ports[0].nodePort}'


# Open prometheus ui
http://<minikube-ip>:<node-port>
```


Remove prometheus stack
```bash
helm list -A

# helm uninstall <name> -n <namespace>
helm uninstall prometheus -n monitoring
helm uninstall prometheus-operator -n monitoring
```


## (Optional) Grafana

Grafana is already installed in the Prometheus helm chart

Portforwarding
```bash
kubectl port-forward service/prometheus-grafana -n monitoring 8081:80

# Now we need the ip and port, the port you can find with the get service command above
# Get Ip
minikube ip


```

The username is admin and the password is prom-operator, you can find also this information in the values.yaml file


## Prometheus

Warning, i found out that the config file under the status->config not up-to-date with the config file in the prometheus
