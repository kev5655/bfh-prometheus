


# Installation

## Requirements

- kubectl
- minikube
- helm
- go

## Minikube
https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download


## Prometheus

- [official repository](https://github.com/prometheus/prometheus?tab=readme-ov-file)
- [helm repository](https://github.com/prometheus-community/helm-charts)


```bash
helm pull prometheus-community/prometheus --untar

kubectl create namespace monitoring

helm install prometheus ./prometheus -n monitoring
```

Access the prometheus
You have two options the easy one is over a port forwaring, but i show you how you can expose promtailn over the minikube ip address over a port.

If you intressete in portforwoading read this
```bash

```



Remove prometheus stack
```bash
helm list -A

# helm uninstall <name> -n <namespace>
helm uninstall prometheus -n default
```

