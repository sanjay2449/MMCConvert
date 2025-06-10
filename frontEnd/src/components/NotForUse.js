const functionRoutesForXeroToXero = {
        Masters: {
        },
        "Open Data": {
        },
        Transaction: {
        }
};
const basicRequirementsForEC2 = {
        "Resource": "Recommended Value",
        "Instance Type": "t2.medium or t3.medium(Burstable, cost - effective)",
        "vCPU": "2 vCPUs",
        "RAM": "8 GB(recommended for smoother experience)",
        "Storage": "100 GB(gp2 or gp3 SSD)",
        "OS": "Ubuntu 22.04 LTS(lightweight, stable)",
        "Network": "Assign Elastic IP + open ports 22(SSH), 80(HTTP), 443(HTTPS), 3000(for React dev), 5000(Node dev)",
}
